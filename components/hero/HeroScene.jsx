'use client'

import { Suspense, useRef } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Float, shaderMaterial } from '@react-three/drei'
import { easing } from 'maath'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Custom holographic material: 3D-noise displacement + iridescent    */
/*  fresnel shading. Reads as premium liquid-chrome glass on white.    */
/* ------------------------------------------------------------------ */

const HoloMaterial = shaderMaterial(
  {
    uTime: 0,
    uDistort: 0.32,
    uFreq: 1.35,
    uMouse: 0,
    uFresnelPower: 2.4,
    uHueShift: 0,
  },
  /* glsl */ `
    uniform float uTime;
    uniform float uDistort;
    uniform float uFreq;
    uniform float uMouse;
    varying vec3 vNormalW;
    varying vec3 vViewDir;
    varying float vDisp;

    // Ashima simplex noise 3D --------------------------------------------------
    vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      float t = uTime * 0.35;
      float n = snoise(position * uFreq + vec3(t, t * 0.7, -t));
      float disp = n * (uDistort + uMouse * 0.18);
      vDisp = disp;

      vec3 displaced = position + normal * disp;

      vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
      vNormalW = normalize(mat3(modelMatrix) * normal);
      vViewDir = normalize(cameraPosition - worldPos.xyz);

      gl_Position = projectionMatrix * viewMatrix * worldPos;
    }
  `,
  /* glsl */ `
    uniform float uTime;
    uniform float uFresnelPower;
    uniform float uHueShift;
    varying vec3 vNormalW;
    varying vec3 vViewDir;
    varying float vDisp;

    // Inigo Quilez cosine palette
    vec3 palette(float t){
      vec3 a = vec3(0.5);
      vec3 b = vec3(0.5);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.00, 0.15, 0.35);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec3 N = normalize(vNormalW);
      vec3 V = normalize(vViewDir);
      float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), uFresnelPower);

      // Iridescent band driven by fresnel, displacement and time.
      float band = fres + vDisp * 1.4 + uTime * 0.03 + uHueShift;
      vec3 irid = palette(band);

      // Pristine near-white core that blooms into iridescence at grazing angles.
      vec3 core = vec3(0.97);
      vec3 col = mix(core, irid, smoothstep(0.05, 0.9, fres));

      // Subtle specular glint
      col += pow(fres, 6.0) * 0.6;

      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }
  `,
)

extend({ HoloMaterial })

function HoloBlob({ pointer }) {
  const group = useRef()
  const mat = useRef()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (mat.current) {
      mat.current.uTime = t
      // Pointer distance from centre drives extra displacement energy.
      const target = Math.hypot(pointer.current.x, pointer.current.y)
      mat.current.uMouse = THREE.MathUtils.lerp(mat.current.uMouse, target, 0.08)
    }
    if (group.current) {
      group.current.rotation.y += delta * 0.12
      easing.damp3(
        group.current.rotation,
        [pointer.current.y * 0.4, group.current.rotation.y + pointer.current.x * 0.0, 0],
        0.5,
        delta,
      )
      easing.damp3(
        group.current.position,
        [pointer.current.x * 0.5, pointer.current.y * 0.35, 0],
        0.5,
        delta,
      )
    }
  })

  return (
    <group ref={group}>
      <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.7}>
        <mesh scale={1.55}>
          <icosahedronGeometry args={[1, 128]} />
          {/* @ts-ignore custom material */}
          <holoMaterial ref={mat} />
        </mesh>
        {/* faint technical wireframe shell rotating within */}
        <mesh scale={1.72} rotation={[0.4, 0.2, 0]}>
          <icosahedronGeometry args={[1, 3]} />
          <meshBasicMaterial wireframe transparent opacity={0.06} color="#0a0a0a" />
        </mesh>
      </Float>
    </group>
  )
}

function Rig({ pointer }) {
  useFrame((state) => {
    pointer.current.x = state.pointer.x
    pointer.current.y = state.pointer.y
  })
  return null
}

export default function HeroScene() {
  const pointer = useRef({ x: 0, y: 0 })

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6], fov: 42 }}
    >
      <Suspense fallback={null}>
        <Rig pointer={pointer} />
        <group position={[2.4, 0.1, 0]}>
          <HoloBlob pointer={pointer} />
        </group>
      </Suspense>
    </Canvas>
  )
}
