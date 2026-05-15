'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const ParticleField = () => {
  const ref = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Stars
        ref={ref}
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={1}
        fade
        speed={1}
      />
    </group>
  );
};

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-ethara-bg">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField />
        <ambientLight intensity={0.5} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ethara-bg/50 to-ethara-bg pointer-events-none" />
    </div>
  );
}
