'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Float,
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  ContactShadows,
} from '@react-three/drei'
import { easing } from 'maath'

/**
 * A single glass-like abstract solid that gently drifts toward the pointer,
 * creating a subtle, luxurious refraction against the white canvas.
 */
function GlassKnot({ pointer }) {
  const group = useRef()
  const mesh = useRef()

  useFrame((state, delta) => {
    // Slow, continuous rotation for life.
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.15
      mesh.current.rotation.y += delta * 0.2
    }
    // Magnetic parallax: ease the whole group toward the pointer.
    if (group.current) {
      easing.damp3(
        group.current.rotation,
        [pointer.current.y * 0.35, pointer.current.x * 0.5, 0],
        0.4,
        delta,
      )
      easing.damp3(
        group.current.position,
        [pointer.current.x * 0.6, pointer.current.y * 0.4, 0],
        0.5,
        delta,
      )
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh ref={mesh} castShadow scale={0.92}>
          <torusKnotGeometry args={[1, 0.32, 240, 36]} />
          <MeshTransmissionMaterial
            samples={10}
            resolution={1024}
            thickness={0.9}
            roughness={0}
            ior={1.42}
            chromaticAberration={0.18}
            anisotropy={0.15}
            distortion={0.25}
            distortionScale={0.3}
            temporalDistortion={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            attenuationDistance={5}
            attenuationColor="#ffffff"
            color="#ffffff"
          />
        </mesh>
      </Float>
    </group>
  )
}

function Rig({ pointer }) {
  useFrame((state) => {
    // Track pointer in normalised device coords (-1..1).
    pointer.current.x = state.pointer.x
    pointer.current.y = state.pointer.y
  })
  return null
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 })

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 40 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow />
        <Rig pointer={pointer} />
        {/* Offset into the right-hand negative space, away from the headline */}
        <group position={[2.6, 0.1, 0]}>
          <GlassKnot pointer={pointer} />
        </group>
        <ContactShadows
          position={[2.6, -2.2, 0]}
          opacity={0.22}
          scale={10}
          blur={2.8}
          far={4.5}
          color="#9a9aa5"
        />
        {/* Custom bright studio: soft rectangular lights create elegant
            specular streaks on the glass while keeping it pristine, not dark. */}
        <Environment resolution={512}>
          <color attach="background" args={['#ffffff']} />
          <Lightformer intensity={2} position={[0, 4, 4]} scale={[8, 3, 1]} />
          <Lightformer intensity={1.4} position={[5, 1, 3]} scale={[3, 6, 1]} />
          <Lightformer
            intensity={1.2}
            position={[-5, -1, 2]}
            scale={[3, 6, 1]}
            color="#eef1ff"
          />
          <Lightformer
            intensity={0.8}
            position={[0, -3, 3]}
            scale={[6, 2, 1]}
            color="#fff5ec"
          />
        </Environment>
      </Suspense>
    </Canvas>
  )
}
