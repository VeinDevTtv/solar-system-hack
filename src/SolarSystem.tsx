// File Name: SolarSystem.tsx
// Author: Abdelkarim
// Purpose: Sets up the Three.js canvas, camera, controls, and includes the Planets component.
// Date: 10/26/2024

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { PointLight } from 'three';
import Planets from './Planets';
import ControlPanel from './components/ControlPanel';
import PlanetInfo from './components/PlanetInfo';
import './styles/main.scss';

// Loading screen component
const LoadingScreen: React.FC<{ onLoaded: () => void }> = ({ onLoaded }) => {
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      onLoaded();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div className="loading-screen">
      <h1>Stellar System</h1>
      <div className="loader"></div>
    </div>
  );
};

// Enhanced lighting component for the scene
const SceneLighting: React.FC<{ 
  sunIntensity: number;
  ambientIntensity: number;
}> = ({ sunIntensity, ambientIntensity }) => {
  // Main sun light
  const sunLight = useRef<PointLight>(null);
  
  // Create a pulsating glow effect for the sun
  useFrame((state) => {
    if (sunLight.current) {
      const time = state.clock.getElapsedTime();
      const baseIntensity = sunIntensity; // Use the passed intensity value
      const intensity = baseIntensity + Math.sin(time * 0.5) * 0.15; // Subtle pulsating
      sunLight.current.intensity = intensity;
    }
  });

  return (
    <>
      {/* Main sun light in the center */}
      <pointLight 
        ref={sunLight} 
        position={[0, 0, 0]} 
        intensity={sunIntensity} 
        color="#FDB813"
        distance={100}
        decay={1.5}
      />
      
      {/* Ambient light for general scene illumination */}
      <ambientLight intensity={ambientIntensity} />
      
      {/* Additional ambient light to ensure planets are visible */}
      <hemisphereLight
        color="#ffffbb"
        groundColor="#080820"
        intensity={ambientIntensity * 1.2}
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

// Constants for time calculation
const SIMULATION_START_DATE = new Date(); // Start simulation from now
const SECONDS_PER_DAY = 86400;
const SIMULATION_SPEED_MULTIPLIER = 5 * SECONDS_PER_DAY; // timeScale=1 means 5 days pass per second

// This component handles time updates within the Canvas
const TimeSimulation: React.FC<{ 
  timeScale: number, 
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
}> = ({ timeScale, setCurrentDate }) => {
  const accumulatedSimTimeSeconds = useRef(0);

  // Update current simulation date based on timeScale and frame delta
  useFrame((state, delta) => {
    // Calculate how much simulation time has passed this frame
    const simSecondsElapsed = delta * timeScale * SIMULATION_SPEED_MULTIPLIER;
    accumulatedSimTimeSeconds.current += simSecondsElapsed;

    // Calculate the new date
    const newSimDate = new Date(SIMULATION_START_DATE.getTime() + accumulatedSimTimeSeconds.current * 1000);
    setCurrentDate(newSimDate);
  });

  return null;
};

const SolarSystem: React.FC = () => {
  const [timeScale, setTimeScale] = useState(1);
  const [currentDate, setCurrentDate] = useState(SIMULATION_START_DATE);
  
  // New state variables for brightness controls
  const [sunIntensity, setSunIntensity] = useState(1.5);
  const [ambientIntensity, setAmbientIntensity] = useState(0.07);
  const [bloomIntensity, setBloomIntensity] = useState(1.3);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading completion
  const handleLoaded = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoaded={handleLoaded} />}
      
      <Canvas
        camera={{ position: [0, 70, 150], fov: 45 }}
        style={{ 
          height: '100vh', 
          width: '100vw',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.5s ease'
        }}
        dpr={[1, 2]} // Dynamic pixel ratio for better performance
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <CameraController />
        <SceneLighting sunIntensity={sunIntensity} ambientIntensity={ambientIntensity} />
        
        {/* Add the time simulation component inside the Canvas */}
        <TimeSimulation timeScale={timeScale} setCurrentDate={setCurrentDate} />
        
        <Stars 
          radius={1000} 
          depth={100} 
          count={7000} 
          factor={4} 
          saturation={0.8} 
          fade 
        />
        
        <Planets currentDate={currentDate} sunEmissiveIntensity={sunIntensity} />
        
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.2}
            luminanceSmoothing={0.8}
            intensity={bloomIntensity}
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
      </Canvas>
      
      {/* Modern UI outside the canvas */}
      <PlanetInfo />
      <ControlPanel 
        timeScale={timeScale}
        sunIntensity={sunIntensity}
        ambientIntensity={ambientIntensity}
        bloomIntensity={bloomIntensity}
        onSunIntensityChange={setSunIntensity}
        onAmbientIntensityChange={setAmbientIntensity}
        onBloomIntensityChange={setBloomIntensity}
        onTimeScaleChange={setTimeScale}
      />
    </>
  );
};

export default SolarSystem;
