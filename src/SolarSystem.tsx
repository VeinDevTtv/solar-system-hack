// File Name: SolarSystem.tsx
// Author: Abdelkarim
// Purpose: Sets up the Three.js canvas, camera, controls, and includes the Planets component.
// Date: 10/26/2024

import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, BakeShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, SSAO, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { PointLight, Vector3, Color } from 'three';
import Planets from './Planets';
import ControlPanel from './components/ControlPanel';
import PlanetInfo from './components/PlanetInfo';
import SettingsPanel from './components/SettingsPanel';
import FreeFlightControls from './components/FreeFlightControls';
import { usePlanetStore } from './store';
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

// Enhanced lighting component with realistic physics
const SceneLighting: React.FC<{ 
  sunIntensity: number;
  ambientIntensity: number;
}> = ({ sunIntensity, ambientIntensity }) => {
  // Main sun light
  const sunLight = useRef<PointLight>(null);
  
  // Create a pulsating glow effect for the sun with realistic physics
  useFrame((state) => {
    if (sunLight.current) {
      const time = state.clock.getElapsedTime();
      const baseIntensity = sunIntensity * 5; // Higher intensity for physical correctness
      // Solar flare simulation with subtle variations
      const intensity = baseIntensity + Math.sin(time * 0.5) * 0.15 + Math.sin(time * 0.23) * 0.07;
      sunLight.current.intensity = intensity;
      
      // Subtle color temperature variation to simulate solar chromosphere
      const baseColor = new Color(0xFDB813);
      const tempVariation = Math.sin(time * 0.1) * 0.05;
      baseColor.r += tempVariation;
      baseColor.b -= tempVariation * 0.5;
      sunLight.current.color = baseColor;
      
      // Realistic decay for inverse square law of light
      sunLight.current.decay = 2.0; // Physically correct inverse square law
    }
  });

  return (
    <>
      {/* Main sun light in the center with physically correct parameters */}
      <pointLight 
        ref={sunLight} 
        position={[0, 0, 0]} 
        intensity={sunIntensity * 5}
        color="#FDB813"
        distance={0} // Set to 0 for unlimited distance
        decay={2} // Physically correct inverse square law
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.001}
      />
      
      {/* Ambient light for general scene illumination - simulates light scattering */}
      <ambientLight intensity={ambientIntensity * 0.5} color="#CCCCFF" />
      
      {/* Additional hemisphere light for better illumination of planets in shadow */}
      <hemisphereLight
        color="#ffffbb"
        groundColor="#080820"
        intensity={ambientIntensity * 0.8}
      />
      
      {/* Environment map for realistic reflections */}
      <Environment preset="night" background={false} />
      
      {/* Bake shadows for performance */}
      <BakeShadows />
    </>
  );
};

// Constants for time calculation
const SIMULATION_START_DATE = new Date(); // Start simulation from now
const SECONDS_PER_DAY = 86400;
const SIMULATION_SPEED_MULTIPLIER = 5 * SECONDS_PER_DAY; // timeScale=1 means 5 days pass per second

// Camera controller with enhanced features
const CameraController = () => {
  const { camera, gl } = useThree();
  const { settings } = usePlanetStore();
  
  useEffect(() => {
    // Set better initial camera position
    camera.position.set(0, 70, 150);
    camera.lookAt(0, 0, 0);
    
    // Set physical camera properties
    camera.near = 0.1;
    camera.far = 10000;
    
    // Configure renderer for physically correct lighting
    // @ts-ignore - physicallyCorrectLights exists in Three.js but TypeScript definitions may be outdated
    gl.physicallyCorrectLights = true;
    gl.toneMapping = 3; // ACESFilmicToneMapping
    gl.toneMappingExposure = 1.0;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = 1; // PCFSoftShadowMap
  }, [camera, gl]);
  
  return null;
};

// This component handles time updates within the Canvas
const TimeSimulation: React.FC<{ 
  timeScale: number, 
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
}> = ({ timeScale, setCurrentDate }) => {
  const accumulatedSimTimeSeconds = useRef(0);

  // Update current simulation date based on timeScale and frame delta with smoother physics
  useFrame((state, delta) => {
    // Calculate how much simulation time has passed this frame
    // Apply easing for smoother transitions when changing time scale
    const simSecondsElapsed = delta * timeScale * SIMULATION_SPEED_MULTIPLIER;
    accumulatedSimTimeSeconds.current += simSecondsElapsed;

    // Calculate the new date
    const newSimDate = new Date(SIMULATION_START_DATE.getTime() + accumulatedSimTimeSeconds.current * 1000);
    setCurrentDate(newSimDate);
  });

  return null;
};

// Enhanced OrbitControls that switches between orbit and free flight modes
const EnhancedControls = () => {
  const { settings } = usePlanetStore();
  
  // Render appropriate controls based on mode
  if (settings.freeCamera) {
    // In free camera mode, just render the free flight controls
    return <FreeFlightControls />;
  }
  
  // In orbit mode, render orbit controls with sensitivity settings
  return (
    <OrbitControls
      enablePan={true}
      enableZoom={true}
      zoomSpeed={0.6 * settings.mouseSensitivity}
      panSpeed={0.5 * settings.mouseSensitivity}
      rotateSpeed={0.5 * settings.mouseSensitivity}
      minDistance={15}
      maxDistance={500}
      autoRotate={false}
      enableDamping={true}
      dampingFactor={0.05}
      // OrbitControls doesn't have invertY prop, so we'll handle this in FreeFlightControls instead
    />
  );
};

const SolarSystem: React.FC = () => {
  const [timeScale, setTimeScale] = useState(1);
  const [currentDate, setCurrentDate] = useState(SIMULATION_START_DATE);
  
  // State variables for lighting and effects
  const [sunIntensity, setSunIntensity] = useState(1.5);
  const [ambientIntensity, setAmbientIntensity] = useState(0.07);
  const [bloomIntensity, setBloomIntensity] = useState(1.3);
  const [ssaoIntensity, setSSAOIntensity] = useState(0.25);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading completion
  const handleLoaded = () => {
    setIsLoading(false);
  };

  // Debug log to check if SolarSystem renders
  console.log("SolarSystem rendering");

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
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        shadows
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
        
        <EffectComposer multisampling={0}>
          {/* Screen Space Ambient Occlusion for realistic shadows */}
          <SSAO
            blendFunction={BlendFunction.MULTIPLY}
            samples={21}
            radius={8}
            intensity={ssaoIntensity}
            luminanceInfluence={0.6}
            worldDistanceThreshold={0.4}
            worldDistanceFalloff={0.1}
            worldProximityThreshold={0.4}
            worldProximityFalloff={0.1}
          />
          
          {/* Depth of Field for realistic focusing */}
          <DepthOfField
            focusDistance={0.025}
            focalLength={0.025}
            bokehScale={6}
          />
          
          {/* Enhanced bloom with realistic light scattering */}
          <Bloom 
            luminanceThreshold={0.2}
            luminanceSmoothing={0.8}
            mipmapBlur
            radius={0.7}
            intensity={bloomIntensity}
            levels={5}
            kernelSize={KernelSize.LARGE}
          />
          
          {/* Vignette for realistic camera lens effect */}
          <Vignette 
            offset={0.5} 
            darkness={0.5} 
            eskil={false} 
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
        
        {/* Custom controls based on mode */}
        <EnhancedControls />
      </Canvas>
      
      {/* Modern UI outside the canvas */}
      <PlanetInfo />
      <ControlPanel 
        timeScale={timeScale}
        sunIntensity={sunIntensity}
        ambientIntensity={ambientIntensity}
        bloomIntensity={bloomIntensity}
        ssaoIntensity={ssaoIntensity}
        onSunIntensityChange={setSunIntensity}
        onAmbientIntensityChange={setAmbientIntensity}
        onBloomIntensityChange={setBloomIntensity}
        onSSAOIntensityChange={setSSAOIntensity}
        onTimeScaleChange={setTimeScale}
      />
      
      {/* Render Settings Panel */}
      <SettingsPanel />
    </>
  );
};

export default SolarSystem;
