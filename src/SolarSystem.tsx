// File Name: SolarSystem.tsx
// Author: Abdelkarim
// Purpose: Sets up the Three.js canvas, camera, controls, and includes the Planets component.
// Date: 10/26/2024

import React, { useState, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Planets from './Planets';

// Component to display time scale
const ScaleDial: React.FC<{ timeScale: number }> = ({ timeScale }) => {
  return (
    <Html position={[-window.innerWidth / 2 + 100, window.innerHeight / 2 - 40, 0]} 
          center 
          style={{ 
            color: 'white', 
            background: 'rgba(0,0,0,0.5)', 
            padding: '5px 10px', 
            borderRadius: '5px',
            pointerEvents: 'none'
          }}>
      <div>
        <div>Time Scale: {timeScale.toFixed(1)}x</div>
        <div style={{ fontSize: '0.7em' }}>Use +/- keys to adjust speed</div>
      </div>
    </Html>
  );
};

// Camera controller to adjust settings
const CameraController = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Set better initial camera position
    camera.position.set(0, 70, 150);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  return null;
};

const SolarSystem: React.FC = () => {
  const [timeScale, setTimeScale] = useState(1);

  // Listen for keyboard shortcuts to adjust time scale
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '+' || e.key === '=') {
        setTimeScale(prev => Math.min(prev * 1.5, 10));
      } else if (e.key === '-' || e.key === '_') {
        setTimeScale(prev => Math.max(prev / 1.5, 0.1));
      } else if (e.key === '0') {
        setTimeScale(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 70, 150], fov: 45 }}
      style={{ height: '100vh', width: '100vw' }}
      dpr={[1, 2]} // Dynamic pixel ratio for better performance
    >
      <CameraController />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 0]} intensity={2} />
      
      <Stars 
        radius={1000} 
        depth={100} 
        count={7000} 
        factor={4} 
        saturation={0.8} 
        fade 
      />
      
      <Planets timeScale={timeScale} />
      
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
        rotateSpeed={0.5}
        minDistance={15}
        maxDistance={500}
        autoRotate={false}
      />
      
      <ScaleDial timeScale={timeScale} />
    </Canvas>
  );
};

export default SolarSystem;
