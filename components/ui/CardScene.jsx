'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Lightformer,
  MeshReflectorMaterial,
  useTexture,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

/* ------------------------------------------------------------------ *
 * A business card as an actual object in an actual studio.
 *
 * Scene units: 0.04 per millimetre, so a 90 x 54mm card is 3.6 x 2.16
 * and the thickness figures below are the real stock gauges.
 * ------------------------------------------------------------------ */
const STOCK = {
  // Duplexed cotton board. Thick enough that the cut edge reads.
  paper: { w: 3.6, h: 2.16, t: 0.05, r: 0.08 },
  // Brushed steel NFC card: thinner, and a larger corner radius because the
  // blank is punched rather than trimmed.
  metal: { w: 3.672, h: 2.16, t: 0.032, r: 0.12 },
}

/** Rounded-rectangle outline, used for both the solid and the printed faces. */
function cardOutline(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

/**
 * Flat face matching the trim exactly.
 *
 * ShapeGeometry hands back UVs in shape coordinates, so they get remapped to
 * 0..1 — otherwise the artwork samples somewhere off in texture space.
 */
function faceGeometry(shape, { w, h }) {
  const g = new THREE.ShapeGeometry(shape, 16)
  const uv = g.attributes.uv
  const pos = g.attributes.position
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5)
  }
  uv.needsUpdate = true
  return g
}

/** The stock itself: extruded, with a slight bevel so the edge catches light. */
function bodyGeometry(shape, { t }) {
  const bevel = t * 0.22
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: t - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 16,
  })
  g.computeBoundingBox()
  const { min, max } = g.boundingBox
  g.translate(0, 0, -(min.z + max.z) / 2)
  g.computeVertexNormals()
  return g
}

/**
 * Paper grain, as a normal map.
 *
 * Uncoated stock is the giveaway detail: without a little tooth in the surface
 * the specular slides across the card like glass and the whole thing reads as
 * a screenshot on a plane instead of something printed.
 */
function createGrainNormal(size = 512) {
  const grid = 256
  const lattice = new Float32Array(grid * grid)
  for (let i = 0; i < lattice.length; i++) lattice[i] = Math.random()

  const at = (x, y) =>
    lattice[(((y % grid) + grid) % grid) * grid + (((x % grid) + grid) % grid)]
  const smooth = (t) => t * t * (3 - 2 * t)

  const height = new Float32Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let value = 0
      let amp = 1
      let freq = grid / size
      let norm = 0
      for (let o = 0; o < 2; o++) {
        const fx = x * freq
        const fy = y * freq
        const x0 = Math.floor(fx)
        const y0 = Math.floor(fy)
        const tx = smooth(fx - x0)
        const ty = smooth(fy - y0)
        const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx
        const bot = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx
        value += (top + (bot - top) * ty) * amp
        norm += amp
        amp *= 0.5
        freq *= 2
      }
      height[y * size + x] = value / norm
    }
  }

  const h = (x, y) =>
    height[(((y % size) + size) % size) * size + (((x % size) + size) % size)]
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (h(x - 1, y) - h(x + 1, y)) * 2.2
      const dy = (h(x, y - 1) - h(x, y + 1)) * 2.2
      const len = Math.hypot(dx, dy, 1)
      const i = (y * size + x) * 4
      data[i] = Math.round(((dx / len) * 0.5 + 0.5) * 255)
      data[i + 1] = Math.round(((dy / len) * 0.5 + 0.5) * 255)
      data[i + 2] = Math.round(((1 / len) * 0.5 + 0.5) * 255)
      data[i + 3] = 255
    }
  }

  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 1.2)
  // Without mipmaps this is sub-pixel detail being point-sampled, which reads
  // as sandpaper rather than paper. Let it average down instead.
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 8
  tex.needsUpdate = true
  return tex
}

/* --- motion ------------------------------------------------------- *
 * One integrator for the whole thing, so drag, inertia and settling are
 * the same continuous system rather than three modes handing off.
 * ------------------------------------------------------------------ */
const FREE_DRAG = 1.25 // damping while genuinely spinning
const SETTLE_DRAG = 4.6 // extra damping folded in as it slows
const SETTLE_K = 11 // restoring stiffness toward the nearest face
const FAST = 3.4 // rad/s above which it spins freely

/**
 * Cards don't rest square to the lens.
 *
 * Settling face-on kills the object — no edge, no thickness, and the highlight
 * sits dead centre. Coming to rest a few degrees off gives every pose a lit
 * edge and a raking specular, which is how the thing gets photographed.
 */
const REST_YAW = -0.44
const REST_PITCH = 0.11

/** Nearest resting pose, optionally that many faces further round. */
function restingYaw(angle, turns = 0) {
  return (
    (Math.round((angle - REST_YAW) / Math.PI) + turns) * Math.PI + REST_YAW
  )
}

function Card({ front, back, stock, spin, pointer, onFacing, calm, onReady }) {
  const pivot = useRef()
  const sway = useRef()
  const facing = useRef(null)

  const maps = useTexture(back ? [front, back] : [front])

  const dim = STOCK[stock]
  const shape = useMemo(() => cardOutline(dim.w, dim.h, dim.r), [dim])
  const geo = useMemo(
    () => ({
      face: faceGeometry(shape, dim),
      body: bodyGeometry(shape, dim),
    }),
    [shape, dim],
  )
  const grain = useMemo(() => createGrainNormal(), [])

  useEffect(() => {
    for (const m of maps) {
      m.colorSpace = THREE.SRGBColorSpace
      m.anisotropy = 8
      m.needsUpdate = true
    }
  }, [maps])

  // This only mounts once useTexture has resolved, so it is the earliest point
  // the card can be shown without the artwork popping in afterwards.
  useEffect(() => onReady(), [onReady])

  useEffect(
    () => () => {
      geo.face.dispose()
      geo.body.dispose()
      grain.dispose()
    },
    [geo, grain],
  )

  const lean = useRef({ x: 0, v: 0 })

  useFrame((state, raw) => {
    const dt = Math.min(raw, 1 / 30)
    const t = state.clock.elapsedTime
    const s = spin.current

    if (!s.dragging) {
      // Nearest resting pose, unless a flip has asked for a specific one.
      const target = s.pending !== null ? s.pending : restingYaw(s.angle)
      const speed = Math.abs(s.velocity)
      // Gate ramps the spring in as the spin dies, so a flick travels freely
      // and then eases home without any visible change of behaviour.
      const gate = s.pending !== null ? 1 : 1 - Math.min(1, speed / FAST)

      s.velocity -= (s.angle - target) * SETTLE_K * gate * dt
      s.velocity *= Math.exp(-(FREE_DRAG + SETTLE_DRAG * gate) * dt)
      s.angle += s.velocity * dt

      if (
        s.pending !== null &&
        Math.abs(s.angle - s.pending) < 0.004 &&
        Math.abs(s.velocity) < 0.05
      ) {
        s.pending = null
      }
    }

    // Tilt: follows the cursor at rest, follows the drag while held.
    const restX = s.dragging ? s.tilt : s.tilt + pointer.current.y * 0.14
    lean.current.v +=
      ((restX - lean.current.x) * 42 - lean.current.v * 9) * dt
    lean.current.x += lean.current.v * dt

    if (pivot.current) {
      pivot.current.rotation.y = s.angle
      pivot.current.rotation.x = THREE.MathUtils.clamp(lean.current.x, -0.44, 0.44)
    }

    // Breathing, on its own group so it never fights the settle.
    if (sway.current && !calm) {
      sway.current.position.y = Math.sin(t * 0.62) * 0.045
      sway.current.rotation.z = Math.sin(t * 0.44 + 1.2) * 0.012
      sway.current.rotation.y = Math.sin(t * 0.37) * 0.035
    }

    const reversed = Math.cos(s.angle) < 0
    if (reversed !== facing.current) {
      facing.current = reversed
      onFacing(reversed)
    }
  })

  const metal = stock === 'metal'

  // Printed stock: matte with a light machine varnish over it, not gloss.
  // Anodised steel: partly metallic rather than fully, because a metalness of 1
  // kills the diffuse term entirely and the etched artwork disappears into
  // reflections of the softboxes.
  const faceMaterial = metal
    ? {
        metalness: 0.62,
        roughness: 0.3,
        envMapIntensity: 1.45,
      }
    : {
        roughness: 0.46,
        clearcoat: 0.55,
        // Soft-touch laminate, not gloss: tight enough to read as a gleam, wide
        // enough that it never looks like plastic.
        clearcoatRoughness: 0.2,
        normalMap: grain,
        normalScale: new THREE.Vector2(0.05, 0.05),
        envMapIntensity: 1.25,
      }

  // The exposed edge. Cream paper core on board; mirror-polished on steel,
  // which is what gives the metal card its jewellery-like rim.
  const edgeMaterial = metal
    ? {
        color: '#b9c0c9',
        metalness: 1,
        roughness: 0.16,
        envMapIntensity: 1.6,
      }
    : {
        color: '#e6e2d8',
        roughness: 0.8,
        clearcoat: 0.08,
        normalMap: grain,
        normalScale: new THREE.Vector2(0.16, 0.16),
        envMapIntensity: 0.85,
      }

  const half = dim.t / 2 + 0.0006

  return (
    <group ref={sway}>
      <group ref={pivot}>
        <mesh geometry={geo.body} castShadow receiveShadow>
          <meshPhysicalMaterial {...edgeMaterial} />
        </mesh>

        <mesh geometry={geo.face} position={[0, 0, half]}>
          <meshPhysicalMaterial map={maps[0]} {...faceMaterial} />
        </mesh>

        <mesh
          geometry={geo.face}
          position={[0, 0, -half]}
          rotation={[0, Math.PI, 0]}
        >
          {back ? (
            <meshPhysicalMaterial map={maps[1]} {...faceMaterial} />
          ) : (
            // One-sided: the reverse is bare stock.
            <meshPhysicalMaterial
              color="#e9e5dc"
              roughness={0.74}
              clearcoat={0.14}
              normalMap={grain}
              normalScale={new THREE.Vector2(0.12, 0.12)}
              envMapIntensity={0.9}
            />
          )}
        </mesh>
      </group>
    </group>
  )
}

/** Softbox rig baked once into an environment map. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <mesh scale={40}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#0b0c0f" side={THREE.BackSide} />
      </mesh>

      {/* Key, overhead and slightly forward. */}
      <Lightformer
        form="rect"
        intensity={3.2}
        color="#ffffff"
        position={[0, 4.2, 2.4]}
        rotation={[-Math.PI / 2.6, 0, 0]}
        scale={[10, 5, 1]}
      />
      {/* Cool strip down the left — this is the highlight that sweeps across
          the face as the card turns. */}
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#c8d4ec"
        position={[-5, 0.6, 2.4]}
        rotation={[0, Math.PI / 2.4, 0]}
        scale={[6, 4, 1]}
      />
      {/* Front-left softbox, sat roughly where the resting face mirrors the
          camera. This is the gleam that rakes across the varnish on the turn —
          without it the print is lit but never actually shines. */}
      <Lightformer
        form="rect"
        intensity={3.4}
        color="#eef3ff"
        position={[-3.4, 1, 4.2]}
        rotation={[0, Math.PI / 5, 0]}
        scale={[2.6, 2.3, 1]}
      />
      {/* Warm rim from the right, to separate the edge from the background. */}
      <Lightformer
        form="rect"
        intensity={3.4}
        color="#ffe9c9"
        position={[5.4, 1.2, 2]}
        rotation={[0, -Math.PI / 2.4, 0]}
        scale={[4.5, 3, 1]}
      />
      {/* Broad frontal fill. Without it the print falls into shadow the moment
          the card turns off-axis, so a spin reads as the card going dark rather
          than as light moving across it. */}
      <Lightformer
        form="rect"
        intensity={1}
        color="#dfe6f2"
        position={[0.4, 0.6, 6.5]}
        scale={[11, 7, 1]}
      />
      <Lightformer
        form="rect"
        intensity={0.6}
        color="#9aa6bd"
        position={[0, -3.6, 2.6]}
        rotation={[Math.PI / 2.6, 0, 0]}
        scale={[7, 3, 1]}
      />
    </Environment>
  )
}

export default function CardScene({
  front,
  back,
  stock = 'paper',
  flipSignal = 0,
  onFacing,
  calm = false,
  active = true,
}) {
  const host = useRef(null)
  const [ready, setReady] = useState(false)
  const onReady = useCallback(() => setReady(true), [])
  const pointer = useRef({ x: 0, y: 0 })
  const drag = useRef({ id: null, x: 0, y: 0, moved: 0, at: 0 })
  const spin = useRef({
    angle: REST_YAW,
    velocity: 0,
    tilt: REST_PITCH,
    dragging: false,
    pending: null,
  })

  // Parent owns the Flip control; a change in the counter is the request.
  const seen = useRef(flipSignal)
  useEffect(() => {
    if (flipSignal === seen.current) return
    seen.current = flipSignal
    spin.current.pending = restingYaw(spin.current.angle, 1)
  }, [flipSignal])

  useEffect(() => {
    const el = host.current
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const down = (e) => {
    const s = spin.current
    s.dragging = true
    s.pending = null
    s.velocity = 0
    drag.current = {
      id: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      moved: 0,
      at: performance.now(),
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
  }

  const move = (e) => {
    const s = spin.current
    if (!s.dragging) return
    const d = drag.current
    const now = performance.now()
    const dt = Math.max(8, now - d.at) / 1000
    const dx = e.clientX - d.x
    const dy = e.clientY - d.y

    const dAngle = (dx / 260) * Math.PI
    s.angle += dAngle
    s.velocity = dAngle / dt
    s.tilt = THREE.MathUtils.clamp(s.tilt - dy / 420, -0.4, 0.4)

    d.moved += Math.abs(dx) + Math.abs(dy)
    d.x = e.clientX
    d.y = e.clientY
    d.at = now
  }

  const up = (e) => {
    const s = spin.current
    if (!s.dragging) return
    s.dragging = false
    // A press that barely travelled is a click, and a click turns it over.
    if (drag.current.moved < 6) s.pending = restingYaw(s.angle, 1)
    // Eases back toward the rest pose rather than toward flat, so the pitch
    // doesn't creep away from the pose after a few drags.
    s.tilt = REST_PITCH + (s.tilt - REST_PITCH) * 0.45
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {}
  }

  const nudge = (dir) => {
    spin.current.pending = null
    spin.current.velocity += dir * 5.5
  }

  return (
    <div
      ref={host}
      className={`absolute inset-0 cursor-grab transition-opacity duration-[900ms] ease-out active:cursor-grabbing [touch-action:pan-y] ${
        ready ? 'opacity-100' : 'opacity-0'
      }`}
      role="button"
      tabIndex={0}
      aria-label="Business card in 3D. Drag to spin, press Enter to turn it over."
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') nudge(1)
        else if (e.key === 'ArrowLeft') nudge(-1)
        else if (e.key === 'Enter' || e.key === ' ') {
          spin.current.pending = restingYaw(spin.current.angle, 1)
        } else return
        e.preventDefault()
      }}
    >
      <Canvas
        shadows
        // "demand" rather than "never" while off screen: it still draws the one
        // frame it needs on mount, then stops until it's actually being looked
        // at. Reflection, bloom and shadow passes are not cheap to leave idling.
        frameloop={active ? 'always' : 'demand'}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          // Neutral rather than ACES: the print has to hold its actual navy and
          // brass, and ACES pulls the saturation out of both.
          toneMapping: THREE.NeutralToneMapping,
          // Held at 1: the rig has to expose for a white card as well as a navy
          // one, and anything hotter clips the bare stock to flat white.
          toneMappingExposure: 1,
        }}
        camera={{ position: [0, 0.3, 7.1], fov: 30 }}
      >
        <Suspense fallback={null}>
          {/* Sat a little above centre so the reflection has room underneath. */}
          <group position={[0, 0.12, 0]}>
            <Card
              front={front}
              back={back}
              stock={stock}
              spin={spin}
              pointer={pointer}
              onFacing={onFacing}
              calm={calm}
              onReady={onReady}
            />
          </group>

          {/* Sharp enough to throw a real highlight across the varnish, and the
              only light casting a shadow — the rest of the modelling comes from
              the environment. */}
          <directionalLight
            position={[-3.4, 5, 4.5]}
            intensity={1.7}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-bias={-0.0005}
          />

          {/* Keeps the face modelled once it has turned past the key. */}
          <directionalLight position={[4.2, 2.4, 3.4]} intensity={0.7} />

          <Studio />

          {/* Fades the far end of the deck into the surround, so the horizon is
              a gradient rather than a hard seam across the frame. */}
          <fogExp2 attach="fog" args={['#0e1014', 0.085]} />

          <ContactShadows
            position={[0, -1.29, 0]}
            opacity={0.62}
            scale={7}
            blur={2.4}
            far={1.4}
            color="#04050a"
          />

          {/* Polished deck, with the card hovering a few millimetres clear of
              it — close enough to throw a tight reflection, not so close that
              a tilt drives a corner through the surface. */}
          <mesh position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 40]} />
            <MeshReflectorMaterial
              resolution={512}
              blur={[130, 40]}
              mixBlur={0.75}
              mixStrength={4.4}
              mirror={0.72}
              depthScale={1.4}
              minDepthThreshold={0.3}
              maxDepthThreshold={1.4}
              color="#0f1116"
              metalness={0.7}
              roughness={0.78}
            />
          </mesh>

          <EffectComposer disableNormalPass>
            {/* Threshold sits above paper white on purpose. Any lower and a
                white card reads as a light source instead of a printed one. */}
            <Bloom
              mipmapBlur
              intensity={0.16}
              luminanceThreshold={0.96}
              luminanceSmoothing={0.18}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
