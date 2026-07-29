'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'

/**
 * Procedural micro-imperfection map.
 *
 * Perfectly uniform roughness is the clearest tell of a CG render — real
 * machined metal has faint smudges and polish variation. A few octaves of
 * value noise, modulating roughness across the surface, break up the
 * reflections just enough to read as a physical object.
 */
function useImperfectionMap() {
  return useMemo(() => {
    const size = 256
    const grid = 32

    const lattice = new Float32Array(grid * grid)
    for (let i = 0; i < lattice.length; i++) lattice[i] = Math.random()

    const at = (x, y) =>
      lattice[(((y % grid) + grid) % grid) * grid + (((x % grid) + grid) % grid)]
    const smooth = (t) => t * t * (3 - 2 * t)

    const data = new Uint8Array(size * size * 4)

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let value = 0
        let amplitude = 0.6
        let frequency = grid / size

        for (let octave = 0; octave < 3; octave++) {
          const fx = x * frequency
          const fy = y * frequency
          const x0 = Math.floor(fx)
          const y0 = Math.floor(fy)
          const tx = smooth(fx - x0)
          const ty = smooth(fy - y0)

          const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx
          const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx
          value += (top + (bottom - top) * ty) * amplitude

          amplitude *= 0.5
          frequency *= 2
        }

        // Keep the map in the upper range so it only ever lightly frosts the
        // polish rather than turning the metal matte.
        const level = Math.round(150 + Math.min(1, Math.max(0, value)) * 105)
        const i = (y * size + x) * 4
        data[i] = level
        data[i + 1] = level
        data[i + 2] = level
        data[i + 3] = 255
      }
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 2)
    texture.anisotropy = 4
    texture.needsUpdate = true
    return texture
  }, [])
}

/**
 * Dark polished metal solid, drifting as though suspended in water.
 *
 * Motion is split across three nested transforms so none of them fight each
 * other: the outer group lags behind the cursor, the middle group traces a
 * slow figure-eight, and the mesh itself turns at a rate that eases in and out
 * rather than at a fixed speed — a constant spin is what reads as mechanical.
 */
function MetalKnot({ pointer }) {
  const lean = useRef()
  const drift = useRef()
  const mesh = useRef()
  const imperfection = useImperfectionMap()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime

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

    // Generous smoothing time so the object trails the cursor languidly
    // instead of snapping to it.
    if (lean.current) {
      easing.damp3(
        lean.current.rotation,
        [-pointer.current.y * 0.42, pointer.current.x * 0.72, 0],
        0.9,
        delta,
      )
      easing.damp3(
        lean.current.position,
        [pointer.current.x * 0.36, pointer.current.y * 0.24, 0],
        0.85,
        delta,
      )
    }
  })

  return (
    <group ref={lean}>
      <group ref={drift}>
        <mesh ref={mesh} castShadow scale={0.78}>
          <torusKnotGeometry args={[1, 0.3, 512, 64]} />
          <meshPhysicalMaterial
            color="#3c3e45"
            metalness={1}
            roughness={0.14}
            roughnessMap={imperfection}
            envMapIntensity={1.35}
            clearcoat={0.85}
            clearcoatRoughness={0.06}
          />
        </mesh>
      </group>
    </group>
  )
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 })

  // Tracked on window (not the canvas) because the hero's WebGL layer is
  // pointer-events:none so it never receives its own pointer events.
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 40 }}
    >
      <Suspense fallback={null}>
        <directionalLight position={[4, 6, 5]} intensity={1.2} castShadow />

        {/* Offset into the right-hand negative space, away from the headline */}
        <group position={[2.12, 0.1, 0]}>
          <MetalKnot pointer={pointer} />
        </group>

        <ContactShadows
          position={[2.12, -2.25, 0]}
          opacity={0.35}
          scale={10}
          blur={2.4}
          far={4.5}
          color="#4a4a55"
        />

        {/* A real photographic HDRI. Metal only looks photoreal when it has a
            genuinely complex world to mirror — synthetic softboxes reflect as
            flat, cartoonish bands. */}
        <Environment preset="warehouse" environmentIntensity={1.1} />

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
