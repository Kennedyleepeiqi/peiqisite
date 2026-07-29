'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Lightformer, ContactShadows } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { easing } from 'maath'

/**
 * Polished chrome solid. The mesh spins slowly so the environment streaks
 * sweep across its surface, while the outer group leans and drifts toward the
 * cursor for a magnetic, hand-follows-mouse feel.
 */
function ChromeKnot({ pointer }) {
  const group = useRef()
  const mesh = useRef()

  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.12
      mesh.current.rotation.y += delta * 0.16
    }

    if (group.current) {
      easing.damp3(
        group.current.rotation,
        [-pointer.current.y * 0.55, pointer.current.x * 0.95, pointer.current.x * 0.08],
        0.35,
        delta,
      )
      easing.damp3(
        group.current.position,
        [pointer.current.x * 0.42, pointer.current.y * 0.28, 0],
        0.45,
        delta,
      )
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
        <mesh ref={mesh} castShadow scale={0.86}>
          <torusKnotGeometry args={[1, 0.33, 320, 48]} />
          <meshPhysicalMaterial
            color="#f2f4f8"
            metalness={1}
            roughness={0.02}
            envMapIntensity={2}
            clearcoat={1}
            clearcoatRoughness={0.01}
          />
        </mesh>
      </Float>
    </group>
  )
}

/**
 * Studio softbox rig. Chrome only reads as chrome when it has both bright
 * highlights and darker falloff to reflect, so the environment carries a
 * mid-tone base with hot rectangular strips over it.
 */
function ChromeStudio() {
  return (
    <Environment resolution={1024}>
      {/* Bright "sky" base with a genuinely dark ground plane below it. The
          hard horizon between the two is what makes chrome read as chrome. */}
      <color attach="background" args={['#b9bcc6']} />
      <mesh position={[0, -6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial color="#0e0e13" />
      </mesh>

      {/* Overhead softbox — the primary broad highlight */}
      <Lightformer
        form="rect"
        intensity={9}
        position={[0, 6, 1]}
        scale={[14, 6, 1]}
        target={[0, 0, 0]}
      />
      {/* Thin, hot strips read as crisp specular bands on polished metal */}
      <Lightformer
        form="rect"
        intensity={14}
        position={[-5, 2, 3]}
        scale={[0.7, 12, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={11}
        position={[5, -1, 3]}
        scale={[0.7, 12, 1]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        intensity={8}
        position={[0, 1, -5]}
        scale={[10, 1.2, 1]}
        target={[0, 0, 0]}
      />
      {/* A single restrained violet accent to echo the headline */}
      <Lightformer
        form="circle"
        intensity={4}
        position={[4, 3, -3]}
        scale={4}
        color="#b7a4ff"
        target={[0, 0, 0]}
      />
    </Environment>
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
        <ambientLight intensity={0.3} />
        <directionalLight position={[4, 6, 5]} intensity={2} castShadow />

        {/* Offset into the right-hand negative space, away from the headline */}
        <group position={[2.35, 0.1, 0]}>
          <ChromeKnot pointer={pointer} />
        </group>

        <ContactShadows
          position={[2.6, -2.25, 0]}
          opacity={0.3}
          scale={10}
          blur={2.6}
          far={4.5}
          color="#7a7a88"
        />

        <ChromeStudio />

        <EffectComposer disableNormalPass>
          <Bloom
            mipmapBlur
            intensity={0.3}
            luminanceThreshold={0.98}
            luminanceSmoothing={0.1}
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  )
}
