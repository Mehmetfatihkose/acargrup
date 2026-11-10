import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 190;

const SparksField: React.FC<{ mouseRef: React.MutableRefObject<{ x: number; y: number }> }> = ({
  mouseRef,
}) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds, phases } = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const spd = new Float32Array(PARTICLE_COUNT);
    const phs = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      spd[i] = 0.004 + Math.random() * 0.009;
      phs[i] = Math.random() * Math.PI * 2;
    }

    return { positions: pos, speeds: spd, phases: phs };
  }, []);

  // Yumuşak dairesel kıvılcım dokusu
  const sparkTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(255, 107, 0, 0.9)');
      grad.addColorStop(1, 'rgba(255, 107, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  useFrame(({ clock }) => {
    const pts = pointsRef.current;
    if (!pts) return;

    const attr = pts.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const elapsed = clock.getElapsedTime();

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      arr[idx + 1] += speeds[i];
      arr[idx] += Math.sin(elapsed * 0.45 + phases[i]) * 0.0022;

      if (arr[idx + 1] > 5.2) {
        arr[idx + 1] = -5.2;
        arr[idx] = (Math.random() - 0.5) * 16;
      }
    }
    attr.needsUpdate = true;

    // Fare hareketiyle hafif sapma
    pts.rotation.y += (mouseRef.current.x * 0.14 - pts.rotation.y) * 0.04;
    pts.rotation.x += (-mouseRef.current.y * 0.08 - pts.rotation.x) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <PointMaterial
        size={0.11}
        map={sparkTexture}
        transparent
        opacity={0.78}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#FF6B00"
      />
    </points>
  );
};

/**
 * Yalnızca masaüstünde ve Hero görünür olduğunda tembel yüklenen Three.js kıvılcım parçacıkları
 */
const HeroParticles: React.FC = () => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [hasWebGL, setHasWebGL] = React.useState(true);

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  if (!hasWebGL) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2]">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
      >
        <SparksField mouseRef={mouseRef} />
      </Canvas>
    </div>
  );
};

export default HeroParticles;
