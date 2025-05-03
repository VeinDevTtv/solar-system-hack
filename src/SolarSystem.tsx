// File Name: SolarSystem.tsx
// Author: Abdelkarim
// Purpose: Sets up the Three.js canvas, camera, controls, and includes the Planets component.
// Date: 10/26/2024

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Text, useHelper } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { PointLightHelper, PointLight, SpotLightHelper, Color } from 'three';
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

// Enhanced lighting component for the scene
const SceneLighting = () => {
  // Main sun light
  const sunLight = useRef<PointLight>(null);
  
  // Create a pulsating glow effect for the sun
  useFrame((state) => {
    if (sunLight.current) {
      const time = state.clock.getElapsedTime();
      const intensity = 2 + Math.sin(time * 0.5) * 0.2; // Subtle pulsating between 1.8 and 2.2
      sunLight.current.intensity = intensity;
    }
  });

  return (
    <>
      {/* Main sun light in the center */}
      <pointLight 
        ref={sunLight} 
        position={[0, 0, 0]} 
        intensity={2} 
        color="#FDB813"
        distance={100}
        decay={1.5}
      />
      
      {/* Ambient light for general scene illumination */}
      <ambientLight intensity={0.07} />
      
      {/* Additional ambient light to ensure planets are visible */}
      <hemisphereLight
        color="#ffffbb"
        groundColor="#080820"
        intensity={0.1}
      />
    </>
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
      gl={{ 
        antialias: true,
        alpha: false,
        powerPreference: "high-performance"
      }}
    >
      <CameraController />
      <SceneLighting />
      
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
          luminanceThreshold={0.2}
          luminanceSmoothing={0.8}
          intensity={1.8}
          radius={0.7}
          levels={5}
          mipmapBlur
        />
        <Vignette 
          offset={0.5} 
          darkness={0.5} 
          eskil={false} 
          blendFunction={BlendFunction.NORMAL}
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
