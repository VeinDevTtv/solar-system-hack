// src/SolarSystem.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Planets from './Planets';

const SolarSystem: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 20, 100], fov: 60 }}
      style={{ height: '100vh', width: '100vw' }}
    >
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      <Stars radius={300} depth={50} count={5000} factor={7} saturation={0} fade />
      <Planets />
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          height={300}
          intensity={1.5}
        />
      </EffectComposer>
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        minDistance={10}
        maxDistance={500}
        autoRotate={true}
        autoRotateSpeed={0.2}
      />
    </Canvas>
  );
};

export default SolarSystem;
