// src/SolarSystem.tsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Planets from './Planets';

const SolarSystem: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 50] }}
      style={{ height: '100vh', width: '100vw' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      <Stars />
      <Planets />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        minDistance={5}
        maxDistance={500}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
};

export default SolarSystem;
