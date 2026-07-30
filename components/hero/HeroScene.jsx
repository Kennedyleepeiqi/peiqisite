'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

/**
 * Seamlessly tiling fractal value noise, returned as a 0..1 height field.
 *
 * Each octave samples a lattice with wrapping indices at a frequency that is
 * an exact multiple of the lattice size, so the field tiles without a seam and
 * can be scrolled indefinitely.
 */
function createNoiseField(size, grid, octaves) {
  const lattice = new Float32Array(grid * grid)
  for (let i = 0; i < lattice.length; i++) lattice[i] = Math.random()

  const at = (x, y) =>
    lattice[(((y % grid) + grid) % grid) * grid + (((x % grid) + grid) % grid)]
  const smooth = (t) => t * t * (3 - 2 * t)

  const field = new Float32Array(size * size)
  let normalisation = 0

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let value = 0
      let amplitude = 1
      let frequency = grid / size
      normalisation = 0

      for (let octave = 0; octave < octaves; octave++) {
        const fx = x * frequency
        const fy = y * frequency
        const x0 = Math.floor(fx)
        const y0 = Math.floor(fy)
        const tx = smooth(fx - x0)
        const ty = smooth(fy - y0)

        const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx
        const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx
        value += (top + (bottom - top) * ty) * amplitude

        normalisation += amplitude
        amplitude *= 0.5
        frequency *= 2
      }

      field[y * size + x] = value / normalisation
    }
  }

  return field
}

/**
 * Micro-imperfection map. Perfectly uniform roughness is the clearest tell of
 * a CG render — real machined metal has faint smudges and polish variation.
 * Values sit in the upper range so this only lightly frosts the polish rather
 * than turning the metal matte.
 */
function createImperfectionMap() {
  const size = 256
  const field = createNoiseField(size, 32, 3)
  const data = new Uint8Array(size * size * 4)

  for (let i = 0; i < field.length; i++) {
    const level = Math.round(150 + field[i] * 105)
    data[i * 4] = level
    data[i * 4 + 1] = level
    data[i * 4 + 2] = level
    data[i * 4 + 3] = 255
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(4, 2)
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

/**
 * Normal map derived from the slope of a noise height field.
 *
 * Scrolling one of these across a mirror-like surface makes the reflections
 * themselves swell and swirl, which is what sells "flowing liquid" — far more
 * convincingly than displacing the geometry, and without disturbing the clean
 * silhouette. Keep the lattice coarse: fine detail reads as hammered metal,
 * broad swells read as water.
 */
function createFlowNormalMap({ size = 256, grid = 8, octaves = 2, strength = 2 }) {
  const field = createNoiseField(size, grid, octaves)
  const height = (x, y) =>
    field[(((y % size) + size) % size) * size + (((x % size) + size) % size)]

  const data = new Uint8Array(size * size * 4)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (height(x - 1, y) - height(x + 1, y)) * strength
      const dy = (height(x, y - 1) - height(x, y + 1)) * strength

      const length = Math.hypot(dx, dy, 1)
      const i = (y * size + x) * 4
      data[i] = Math.round(((dx / length) * 0.5 + 0.5) * 255)
      data[i + 1] = Math.round(((dy / length) * 0.5 + 0.5) * 255)
      data[i + 2] = Math.round((1 / length * 0.5 + 0.5) * 255)
      data[i + 3] = 255
    }
  }

  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

const RIPPLE_COUNT = 4
const RIPPLE_LIFETIME = 5

/**
 * Polished metal, with ripples that spread from wherever the cursor touches it.
 *
 * The wave is evaluated per vertex as a height field, and what gets handed to
 * the fragment stage is its *gradient* — perturbing the surface normal makes
 * the reflections bend, which on a mirror-like material is far more convincing
 * (and far cheaper) than physically displacing the geometry.
 */
function createMetalMaterial({ imperfection, flowA, flowB }) {
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#3c3e45'),
    metalness: 1,
    roughness: 0.14,
    roughnessMap: imperfection,
    envMapIntensity: 1.35,
    normalMap: flowA,
    clearcoat: 0.85,
    clearcoatRoughness: 0.06,
    clearcoatNormalMap: flowB,
  })

  // Restrained on purpose: push these up and the metal starts to look hammered
  // or dented instead of liquid.
  material.normalScale.set(0.45, 0.45)
  material.clearcoatNormalScale.set(0.32, 0.32)

  const uniforms = {
    uTime: { value: 0 },
    uImpactPos: {
      value: Array.from({ length: RIPPLE_COUNT }, () => new THREE.Vector3(1e3, 1e3, 1e3)),
    },
    uImpactTime: { value: new Array(RIPPLE_COUNT).fill(-1e3) },
    uImpactStrength: { value: new Array(RIPPLE_COUNT).fill(0) },
    uRippleAmp: { value: 0.05 },
    uRippleFreq: { value: 9 },
    uRippleSpeed: { value: 4.5 },
    uRippleFalloff: { value: 1.6 },
    uRippleDecay: { value: 1.15 },
  }

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)

    shader.vertexShader =
      `
      #define RIPPLE_COUNT ${RIPPLE_COUNT}
      uniform float uTime;
      uniform vec3 uImpactPos[RIPPLE_COUNT];
      uniform float uImpactTime[RIPPLE_COUNT];
      uniform float uImpactStrength[RIPPLE_COUNT];
      uniform float uRippleAmp;
      uniform float uRippleFreq;
      uniform float uRippleSpeed;
      uniform float uRippleFalloff;
      uniform float uRippleDecay;
      varying vec3 vRippleGrad;
    ` + shader.vertexShader

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>

      vec3 rippleGrad = vec3(0.0);

      for (int i = 0; i < RIPPLE_COUNT; i++) {
        float age = uTime - uImpactTime[i];
        // step() rather than an early-out: branching on a loop counter is
        // poorly supported on older GL ES targets.
        float gate = step(0.0, age) * step(age, ${RIPPLE_LIFETIME}.0) * uImpactStrength[i];

        vec3 rel = position - uImpactPos[i];
        float d = length(rel);

        // Height h = envelope * sin(phase); we need dh/dd to bend the normal.
        float envelope = exp(-d * uRippleFalloff) * exp(-age * uRippleDecay);
        float phase = d * uRippleFreq - age * uRippleSpeed;
        float dhdd = envelope * (uRippleFreq * cos(phase) - uRippleFalloff * sin(phase));

        rippleGrad += (rel / max(d, 1e-4)) * dhdd * uRippleAmp * gate;
      }

      vRippleGrad = normalMatrix * rippleGrad;
      `,
    )

    shader.fragmentShader = 'varying vec3 vRippleGrad;\n' + shader.fragmentShader
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <normal_fragment_maps>',
      `
      #include <normal_fragment_maps>
      normal = normalize(normal - vRippleGrad);
      `,
    )
  }

  return { material, uniforms }
}

// Tuned for roughly 5% overshoot settling in ~0.6s: enough to feel like the
// object carries weight, restrained enough that it never reads as bouncy.
const LEAN_SPRING = { stiffness: 90, damping: 13 }

// Deliberately soft and underdamped (ζ ≈ 0.35). A nudge here doesn't return
// directly to rest — it drifts out, rocks back past centre and settles over
// about two seconds, which is what gives the recoil its balloon-like buoyancy.
const PUSH_SPRING = { stiffness: 26, damping: 3.6 }

function stepSpring(spring, target, delta, { stiffness, damping }) {
  const acceleration =
    (target - spring.value) * stiffness - spring.velocity * damping
  spring.velocity += acceleration * delta
  spring.value += spring.velocity * delta
  return spring.value
}

/**
 * Dark polished metal solid, drifting as though suspended in water.
 *
 * Motion is split across three nested transforms so none of them fight each
 * other: the outer group springs toward the cursor, the middle group traces a
 * slow figure-eight, and the mesh itself turns at a rate that eases in and out
 * rather than at a fixed speed — a constant spin is what reads as mechanical.
 */
function MetalKnot({ pointer, stir }) {
  const push = useRef()
  const lean = useRef()
  const drift = useRef()
  const mesh = useRef()

  const elapsed = useRef(0)
  const ripple = useRef({ next: 0, lastSpawn: -1 })
  const nudge = useRef({ lastPush: -1 })
  const springs = useRef({
    rotX: { value: 0, velocity: 0 },
    rotY: { value: 0, velocity: 0 },
    posX: { value: 0, velocity: 0 },
    posY: { value: 0, velocity: 0 },
    pushX: { value: 0, velocity: 0 },
    pushY: { value: 0, velocity: 0 },
    pushZ: { value: 0, velocity: 0 },
    swell: { value: 0, velocity: 0 },
  })

  // Reused so a pointer sweep doesn't allocate a vector per event.
  const scratch = useMemo(
    () => ({ centre: new THREE.Vector3(), away: new THREE.Vector3() }),
    [],
  )

  // Two layers at different scales, scrolled in opposing directions. Where the
  // two sets of swells cross they interfere, which is what stops the flow from
  // looking like a texture sliding in one direction.
  const { imperfection, flowA, flowB } = useMemo(
    () => ({
      imperfection: createImperfectionMap(),
      flowA: createFlowNormalMap({ grid: 8, octaves: 2, strength: 2 }),
      flowB: createFlowNormalMap({ grid: 12, octaves: 3, strength: 1.6 }),
    }),
    [],
  )

  const { material, uniforms } = useMemo(
    () => createMetalMaterial({ imperfection, flowA, flowB }),
    [imperfection, flowA, flowB],
  )

  useEffect(() => {
    flowA.repeat.set(2, 1)
    flowB.repeat.set(3, 1.5)
  }, [flowA, flowB])

  useEffect(
    () => () => {
      imperfection.dispose()
      flowA.dispose()
      flowB.dispose()
      material.dispose()
    },
    [imperfection, flowA, flowB, material],
  )

  /**
   * Records a ripple origin in the mesh's own geometry space, which is the
   * space the vertex shader compares against.
   */
  const spawnRipple = (event, strength) => {
    if (!mesh.current) return

    const time = elapsed.current
    // Throttled so a fast sweep leaves a wake rather than a solid smear.
    if (strength <= 1 && time - ripple.current.lastSpawn < 0.1) return

    const local = mesh.current.worldToLocal(event.point.clone())
    const slot = ripple.current.next % RIPPLE_COUNT

    uniforms.uImpactPos.value[slot].copy(local)
    uniforms.uImpactTime.value[slot] = time
    uniforms.uImpactStrength.value[slot] = strength

    ripple.current.next = slot + 1
    ripple.current.lastSpawn = time
  }

  /**
   * Shoves the object away from the point of contact.
   *
   * The impulse goes into the spring's velocity rather than its target, so
   * there is nothing for it to settle towards except centre — it gets knocked
   * aside and finds its own way back. Depth is heavily damped because a poke
   * straight into the screen barely reads in perspective, whereas the same
   * energy spent sideways is legible.
   */
  const applyPush = (event, gain) => {
    if (!mesh.current || !push.current) return

    const time = elapsed.current
    if (time - nudge.current.lastPush < 0.22) return

    // Only respond to a cursor that's actually travelling. Resting on the
    // object shouldn't pump it, and a slow graze should barely move it.
    const speed = Math.hypot(stir.current.x, stir.current.y)
    if (gain < 2 && speed < 0.012) return

    mesh.current.getWorldPosition(scratch.centre)
    const away = scratch.away.copy(scratch.centre).sub(event.point)
    away.z *= 0.3
    if (away.lengthSq() < 1e-6) return
    away.normalize()

    const impulse = gain * (0.5 + Math.min(1, speed * 4) * 0.8)
    const s = springs.current

    // Velocities are clamped rather than summed freely: a frantic cursor should
    // keep it afloat, not pump it out of frame.
    s.pushX.velocity = THREE.MathUtils.clamp(s.pushX.velocity + away.x * impulse, -1.1, 1.1)
    // A touch of lift on top of the sideways shove, so it rises as it recoils.
    s.pushY.velocity = THREE.MathUtils.clamp(
      s.pushY.velocity + away.y * impulse + impulse * 0.12,
      -1.1,
      1.1,
    )
    s.pushZ.velocity = THREE.MathUtils.clamp(s.pushZ.velocity + away.z * impulse * 0.6, -0.7, 0.7)
    // Negative: it compresses under the touch first, then swells back past its
    // resting size. Kept tiny — a few percent is buoyant, more is cartoonish.
    s.swell.velocity = THREE.MathUtils.clamp(s.swell.velocity - impulse * 0.4, -0.9, 0.9)

    nudge.current.lastPush = time
  }

  useFrame((state, rawDelta) => {
    // Clamp so a backgrounded tab can't hand us a huge step and blow up the
    // spring integration.
    const delta = Math.min(rawDelta, 1 / 30)
    const t = state.clock.elapsedTime

    elapsed.current = t
    uniforms.uTime.value = t

    // Cursor velocity stirs the surface: the flow leans the way you swept, and
    // churns harder the faster you moved.
    const sx = stir.current.x
    const sy = stir.current.y
    const agitation = Math.min(1, Math.hypot(sx, sy) * 2.2)

    flowA.offset.x += delta * (0.035 + sx * 0.85)
    flowA.offset.y += delta * (0.018 - sy * 0.55)
    flowB.offset.x -= delta * (0.026 - sx * 0.6)
    flowB.offset.y += delta * (0.031 + sy * 0.7)

    // Drifting the polish variation too, so the sheen migrates with the flow.
    imperfection.offset.x += delta * 0.012
    imperfection.offset.y -= delta * 0.008

    material.normalScale.setScalar(0.45 + agitation * 0.18)
    material.clearcoatNormalScale.setScalar(0.32 + agitation * 0.12)

    // Bleed the stir off so the surface settles when the cursor stops.
    const decay = Math.exp(-delta * 2.6)
    stir.current.x *= decay
    stir.current.y *= decay

    if (mesh.current) {
      // Incommensurate frequencies keep the rhythm from ever looping audibly.
      mesh.current.rotation.y += delta * (0.085 + 0.065 * Math.sin(t * 0.29))
      mesh.current.rotation.x += delta * (0.04 + 0.04 * Math.sin(t * 0.21 + 1.1))
      mesh.current.rotation.z = Math.sin(t * 0.17) * 0.24
    }

    if (drift.current) {
      drift.current.position.set(
        Math.sin(t * 0.23) * 0.2,
        Math.sin(t * 0.31 + 0.7) * 0.16,
        0,
      )
      drift.current.rotation.z = Math.sin(t * 0.13 + 2.1) * 0.1
    }

    // Springs rather than exponential damping, so it overshoots very slightly
    // and settles back — the difference between "eased" and "has mass".
    if (lean.current) {
      const s = springs.current
      const cfg = LEAN_SPRING
      lean.current.rotation.x = stepSpring(s.rotX, -pointer.current.y * 0.42, delta, cfg)
      lean.current.rotation.y = stepSpring(s.rotY, pointer.current.x * 0.72, delta, cfg)
      lean.current.position.x = stepSpring(s.posX, pointer.current.x * 0.36, delta, cfg)
      lean.current.position.y = stepSpring(s.posY, pointer.current.y * 0.24, delta, cfg)
    }

    // The recoil rides on top of the lean rather than replacing it, so being
    // knocked aside and drifting after the cursor can happen at once.
    if (push.current) {
      const s = springs.current
      push.current.position.set(
        stepSpring(s.pushX, 0, delta, PUSH_SPRING),
        stepSpring(s.pushY, 0, delta, PUSH_SPRING),
        stepSpring(s.pushZ, 0, delta, PUSH_SPRING),
      )
      push.current.scale.setScalar(1 + stepSpring(s.swell, 0, delta, PUSH_SPRING) * 0.055)
    }
  })

  return (
    // Outermost so its axes stay world-aligned: the recoil should travel the
    // direction the cursor pushed, not a direction skewed by the lean.
    <group ref={push}>
      <group ref={lean}>
        <group ref={drift}>
          <mesh ref={mesh} castShadow scale={0.78}>
            {/* 256×32 rather than 512×64: a quarter of the triangles for no
                visible difference at this on-screen size. The ripple
                displacement is computed per-vertex, so this is the floor —
                going lower starts to facet the wavefront. */}
            <torusKnotGeometry args={[1, 0.3, 256, 32]} />
            <primitive object={material} attach="material" />

            {/* Invisible stand-in for hit testing. It inherits this mesh's
                exact transform, so contact points map straight onto the
                visible surface — but at a fraction of the triangles, since
                raycasting the 65k-triangle display mesh on every pointer move
                is wasteful. */}
            <mesh
              visible={false}
              onPointerEnter={(e) => {
                e.stopPropagation()
                applyPush(e, 1.15)
              }}
              onPointerMove={(e) => {
                e.stopPropagation()
                spawnRipple(e, 1)
                applyPush(e, 0.85)
              }}
              onPointerDown={(e) => {
                e.stopPropagation()
                spawnRipple(e, 2.4)
                applyPush(e, 2.1)
              }}
            >
              <torusKnotGeometry args={[1, 0.3, 96, 16]} />
            </mesh>
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default function HeroScene({ active = true }) {
  const pointer = useRef({ x: 0, y: 0 })
  const stir = useRef({ x: 0, y: 0 })

  // Tracked on window rather than on the canvas so the object still answers to
  // the cursor while it's over the headline or the CTAs.
  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -((e.clientY / window.innerHeight) * 2 - 1)

      // Accumulate the frame's travel and clamp it — a flick across the whole
      // viewport shouldn't be able to send the flow into a blur.
      stir.current.x = THREE.MathUtils.clamp(stir.current.x + (x - pointer.current.x), -0.5, 0.5)
      stir.current.y = THREE.MathUtils.clamp(stir.current.y + (y - pointer.current.y), -0.5, 0.5)

      pointer.current.x = x
      pointer.current.y = y
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      shadows
      // Stops drawing once the hero has scrolled away, so it isn't competing
      // for the GPU with the card scene further down the page.
      frameloop={active ? 'always' : 'demand'}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 40 }}
    >
      <Suspense fallback={null}>
        <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow />

        {/* Offset into the right-hand negative space, away from the headline */}
        <group position={[1.82, 0.1, 0]}>
          <MetalKnot pointer={pointer} stir={stir} />
        </group>

        <ContactShadows
          position={[1.82, -2.25, 0]}
          opacity={0.35}
          scale={10}
          blur={2.4}
          far={4.5}
          color="#4a4a55"
        />

        {/* A real photographic HDRI. Metal only looks photoreal when it has a
            genuinely complex world to mirror — synthetic softboxes reflect as
            flat, cartoonish bands.

            Served from public/ rather than via preset="warehouse": that preset
            pulls the same file from a third-party CDN at runtime, which would
            put someone else's uptime in front of our first impression. */}
        <Environment
          files="/hdri/empty_warehouse_01_1k.hdr"
          environmentIntensity={1.1}
        />

        <EffectComposer disableNormalPass>
          <Bloom
            mipmapBlur
            intensity={0.22}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.2}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}

