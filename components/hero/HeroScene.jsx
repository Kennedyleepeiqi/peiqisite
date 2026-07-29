'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

/* Nested rings, each tumbling on its own axis at its own rate. */
const RINGS = [
  { radius: 1.85, tube: 0.008, tilt: [Math.PI / 2, 0, 0], speed: 0.18, color: '#b9bdc9' },
  { radius: 1.52, tube: 0.018, tilt: [0.35, 0.25, 0.1], speed: -0.3, color: '#e9ebf0' },
  { radius: 1.2, tube: 0.028, tilt: [1.15, 0.55, 0.2], speed: 0.44, color: '#f2f3f7' },
  { radius: 0.88, tube: 0.042, tilt: [0.25, 1.25, 0.45], speed: -0.62, color: '#dfe2ff' },
]

const TICKS = 84
const BEZEL_RADIUS = 2.1

function Ring({ radius, tube, tilt, speed, color }) {
  const mesh = useRef(null)
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.x += delta * speed
  })
  return (
    <group rotation={tilt}>
      <mesh ref={mesh}>
        <torusGeometry args={[radius, tube, 24, 220]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.06} />
      </mesh>
    </group>
  )
}

/** A machined bezel of fine tick marks — the "instrument" detail. */
function Bezel() {
  const mesh = useRef(null)

  useEffect(() => {
    if (!mesh.current) return
    const dummy = new THREE.Object3D()
    for (let i = 0; i < TICKS; i++) {
      const a = (i / TICKS) * Math.PI * 2
      const long = i % 7 === 0
      dummy.position.set(Math.cos(a) * BEZEL_RADIUS, Math.sin(a) * BEZEL_RADIUS, 0)
      dummy.rotation.set(0, 0, a)
      dummy.scale.set(long ? 0.11 : 0.05, 0.006, 0.006)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  }, [])

  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.z += delta * 0.05
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, TICKS]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#9aa0ad" metalness={0.9} roughness={0.3} />
    </instancedMesh>
  )
}

/** Micro satellites tracing the inner orbits. */
function Satellites() {
  const group = useRef(null)
  const items = useMemo(
    () => [
      { r: 1.52, speed: 0.55, offset: 0, tilt: [0.35, 0.25, 0.1], size: 0.045, accent: false },
      { r: 1.2, speed: -0.8, offset: 2.1, tilt: [1.15, 0.55, 0.2], size: 0.035, accent: true },
      { r: 0.88, speed: 1.1, offset: 4.2, tilt: [0.25, 1.25, 0.45], size: 0.03, accent: false },
    ],
    [],
  )
  const refs = useRef([])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    items.forEach((it, i) => {
      const el = refs.current[i]
      if (!el) return
      const a = t * it.speed + it.offset
      el.position.set(Math.cos(a) * it.r, Math.sin(a) * it.r, 0)
    })
  })

  return (
    <group ref={group}>
      {items.map((it, i) => (
        <group key={i} rotation={it.tilt}>
          <mesh ref={(el) => (refs.current[i] = el)}>
            <sphereGeometry args={[it.size, 24, 24]} />
            {it.accent ? (
              <meshStandardMaterial
                color="#5b5bff"
                emissive="#5b5bff"
                emissiveIntensity={0.9}
                roughness={0.25}
                metalness={0.4}
              />
            ) : (
              <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.05} />
            )}
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Gyroscope({ pointer }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime

    // Damped tilt toward the cursor, layered over a slow idle drift.
    const targetX = pointer.current.y * -0.45 + Math.sin(t * 0.18) * 0.05
    const targetY = pointer.current.x * 0.55 + Math.cos(t * 0.14) * 0.06
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.6, delta)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.6, delta)

    // Breathing scale keeps it feeling alive.
    const s = 1 + Math.sin(t * 0.5) * 0.012
    g.scale.setScalar(s)
  })

  return (
    <group ref={group}>
      <Bezel />
      {RINGS.map((r, i) => (
        <Ring key={i} {...r} />
      ))}
      <Satellites />

      {/* Core: a polished bearing wrapped in a faint accent halo */}
      <mesh>
        <sphereGeometry args={[0.2, 48, 48]} />
        <meshStandardMaterial color="#fafbfd" metalness={1} roughness={0.03} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshBasicMaterial color="#5b5bff" transparent opacity={0.07} />
      </mesh>
    </group>
  )
}

export default function HeroScene() {
  // Tracked at window level so the sculpture still reacts while the canvas
  // layer stays pointer-transparent for the text and buttons above it.
  const pointer = useRef(new THREE.Vector2(0, 0))

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.4], fov: 42 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} />

        <group position={[2.55, 0.05, 0]} scale={0.8}>
          <Gyroscope pointer={pointer} />
        </group>

        {/* A mid-grey surround with bright panels: the contrast between the two
            is what makes the metal read as polished chrome. */}
        <Environment resolution={512}>
          <color attach="background" args={['#b9bec9']} />
          <Lightformer intensity={3} position={[0, 5, 3]} scale={[10, 4, 1]} />
          <Lightformer intensity={2} position={[5, 0, 2]} scale={[3, 10, 1]} />
          <Lightformer
            intensity={1.6}
            position={[-5, 1, 2]}
            scale={[3, 10, 1]}
            color="#e2e6ff"
          />
          <Lightformer
            intensity={1.2}
            position={[0, -4, 2]}
            scale={[8, 3, 1]}
            color="#fff2e6"
          />
        </Environment>
      </Suspense>
    </Canvas>
  )
}
