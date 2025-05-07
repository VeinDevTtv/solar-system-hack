// File Name: Planets.tsx
// Author: Abdelkarim
// Purpose: Renders all planets and moons, updates their positions, and handles interactions.
// Date: 10/26/2024

import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, DoubleSide, Color, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import * as Astronomy from 'astronomy-engine'; // Import the library
import { usePlanetStore, PlanetPosition } from './store';
import Orbit from './Orbit';

// Import environment textures
import { useTexture } from '@react-three/drei';

interface MoonData {
  name: string;
  texture: string;
  normalMap?: string; // Added normal map for advanced lighting
  roughnessMap?: string; // Added roughness map for PBR
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  realOrbitRadius: number; // in million km
  realDiameter: number; // in km
  rotationSpeed: number; // in radians per frame
  orbitalPeriod: number; // in Earth days
  parentIndex?: number;
}

interface PlanetData {
  name: string;
  texture: string;
  normalMap?: string; // Added normal map for advanced lighting
  roughnessMap?: string; // Added roughness map for PBR
  cloudsMap?: string; // Added clouds map for Earth-like planets
  size?: number; // Optional for now
  orbitRadius?: number; // Optional for now
  orbitSpeed?: number; // Optional for now
  rotationSpeed: number;
  realOrbitRadius: number;
  realDiameter: number;
  orbitalPeriod?: number; // Optional for now
  axialTilt?: number;
  eccentricity?: number; // Optional for now
  color?: string;
  atmosphereColor?: string; // Added atmosphere color
  cloudSpeed?: number; // Cloud rotation speed
  moons?: MoonData[];
}

// Constants for scale conversion
const SIZE_SCALE_FACTOR = 0.000035;
const AU_TO_SCENE_SCALE = 50;

// Scale functions
const scaleSize = (realSizeKm: number) => Math.max(0.35, realSizeKm * SIZE_SCALE_FACTOR);
const scaleRotation = (rotationPeriodHours: number) => rotationPeriodHours ? 0.005 / rotationPeriodHours : 0;

// Temporarily re-add scaleDistance and scaleSpeed for moons BEFORE planetData definition
const scaleDistance = (realDistanceMKm: number) => realDistanceMKm * 0.025; // Old factor for moon orbits for now
const scaleSpeed = (orbitalPeriodDays: number) => (orbitalPeriodDays ? 2 * Math.PI / (orbitalPeriodDays * 0.005) : 0); // Old factor for moon orbits for now

// Exporting planetData (Now matches the optional fields in PlanetData interface)
export const planetData: PlanetData[] = [
  {
    name: 'Sun',
    texture: '/textures/sun.jpg',
    rotationSpeed: scaleRotation(609.6),
    realOrbitRadius: 0,
    realDiameter: 1392000,
    axialTilt: 7.25,
    color: '#FDB813',
  },
  {
    name: 'Mercury',
    texture: '/textures/mercury.jpg',
    rotationSpeed: scaleRotation(1407.6),
    realOrbitRadius: 57.9,
    realDiameter: 4879,
    axialTilt: 0.034,
    color: '#9F9F9F',
  },
  {
    name: 'Venus',
    texture: '/textures/venus.jpg',
    rotationSpeed: scaleRotation(-5832),
    realOrbitRadius: 108.2,
    realDiameter: 12104,
    axialTilt: 177.4,
    color: '#E6E6B8',
    atmosphereColor: '#f0d080',
  },
  {
    name: 'Earth',
    texture: '/textures/earth.jpg',
    rotationSpeed: scaleRotation(24),
    realOrbitRadius: 149.6,
    realDiameter: 12756,
    axialTilt: 23.4,
    color: '#2E5F98',
    atmosphereColor: '#bbd4ff',
    moons: [
      {
        name: 'Moon',
        texture: '/textures/moon.jpg',
        size: scaleSize(3475),
        orbitRadius: scaleDistance(0.384),
        orbitSpeed: scaleSpeed(27.3),
        rotationSpeed: scaleRotation(655.2),
        realOrbitRadius: 0.384,
        realDiameter: 3475,
        orbitalPeriod: 27.3,
      },
    ],
  },
  {
    name: 'Mars',
    texture: '/textures/mars.jpg',
    rotationSpeed: scaleRotation(24.7),
    realOrbitRadius: 227.9,
    realDiameter: 6792,
    axialTilt: 25.2,
    color: '#E67A45',
    atmosphereColor: '#ffd9bb',
    moons: [
      {
        name: 'Phobos',
        texture: '/textures/phobos.jpg',
        size: scaleSize(22.2),
        orbitRadius: scaleDistance(0.0094),
        orbitSpeed: scaleSpeed(0.3189),
        rotationSpeed: scaleRotation(7.66),
        realOrbitRadius: 0.0094,
        realDiameter: 22.2,
        orbitalPeriod: 0.3189,
      },
      {
        name: 'Deimos',
        texture: '/textures/deimos.jpg',
        size: scaleSize(12.6),
        orbitRadius: scaleDistance(0.0235),
        orbitSpeed: scaleSpeed(1.263),
        rotationSpeed: scaleRotation(30.3),
        realOrbitRadius: 0.0235,
        realDiameter: 12.6,
        orbitalPeriod: 1.263,
      },
    ],
  },
  {
    name: 'Jupiter',
    texture: '/textures/jupiter.jpg',
    rotationSpeed: scaleRotation(9.9),
    realOrbitRadius: 778.6,
    realDiameter: 142984,
    axialTilt: 3.1,
    color: '#B3A06D',
    atmosphereColor: '#d9c896',
  },
  {
    name: 'Saturn',
    texture: '/textures/saturn.jpg',
    rotationSpeed: scaleRotation(10.7),
    realOrbitRadius: 1433.5,
    realDiameter: 120536,
    axialTilt: 26.7,
    color: '#EACE87',
    atmosphereColor: '#fff2d1',
  },
  {
    name: 'Uranus',
    texture: '/textures/uranus.jpg',
    rotationSpeed: scaleRotation(-17.2),
    realOrbitRadius: 2872.5,
    realDiameter: 51118,
    axialTilt: 97.8,
    color: '#D1E7E7',
    atmosphereColor: '#e5ffff',
  },
  {
    name: 'Neptune',
    texture: '/textures/neptune.jpg',
    rotationSpeed: scaleRotation(16.1),
    realOrbitRadius: 4495.1,
    realDiameter: 49528,
    axialTilt: 28.3,
    color: '#3E66F9',
    atmosphereColor: '#b8c3ff',
  },
];

// Accept currentDate from parent component
interface PlanetsProps {
  currentDate: Date;
  sunEmissiveIntensity?: number; // Added prop for sun's emissive intensity
}

const Planets: React.FC<PlanetsProps> = ({ currentDate, sunEmissiveIntensity = 1.5 }) => {
  const { setSelectedPlanet, selectedPlanet, setAllPlanetPositions } = usePlanetStore();

  // Refs for planets and clouds
  const planetMeshRefs = useRef<(Mesh | null)[]>([]); 
  const cloudsMeshRefs = useRef<(Mesh | null)[]>([]);
  const atmosphereMeshRefs = useRef<(Mesh | null)[]>([]);
  
  // Load planet textures
  const planetTextures = useLoader(
    TextureLoader,
    planetData.map((planet) => planet.texture)
  );
  
  // Always load textures, but with empty arrays if none are available
  // This ensures hooks are always called in the same order
  const normalMaps = useLoader(
    TextureLoader,
    planetData.filter(planet => planet.normalMap).map(planet => planet.normalMap!) || []
  );
  
  const roughnessMaps = useLoader(
    TextureLoader,
    planetData.filter(planet => planet.roughnessMap).map(planet => planet.roughnessMap!) || []
  );
  
  const cloudsMaps = useLoader(
    TextureLoader,
    planetData.filter(planet => planet.cloudsMap).map(planet => planet.cloudsMap!) || []
  );

  // Load the ring texture for Saturn's rings
  const ringTexture = useLoader(TextureLoader, '/textures/saturn_ring.png');
  // Fallback to regular texture if alpha isn't available
  const ringAlphaTexture = useLoader(TextureLoader, '/textures/saturn_ring.png');
  
  // Prepare moon data
  const moonsData = planetData.flatMap((planet, pIndex) =>
    planet.moons?.map((moon) => ({
      ...moon,
      parentIndex: pIndex,
    })) || []
  );

  // Refs and textures for moons
  const moonMeshRefs = useRef<(Mesh | null)[]>([]); 
  const moonTextures = useLoader(
    TextureLoader,
    moonsData.map((moon) => moon.texture)
  );
  
  // Always load textures, but with empty arrays if none are available
  const moonNormalMaps = useLoader(
    TextureLoader,
    moonsData.filter(moon => moon.normalMap).map(moon => moon.normalMap!) || []
  );

  const moonRoughnessMaps = useLoader(
    TextureLoader,
    moonsData.filter(moon => moon.roughnessMap).map(moon => moon.roughnessMap!) || []
  );

  // Ring ref for Saturn
  const ringRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();
    const newPlanetPositions: PlanetPosition = {}; 

    planetData.forEach((planet, index) => {
      const planetMesh = planetMeshRefs.current[index];
      let positionX = 0, positionY = 0, positionZ = 0;

      if (planet.name === 'Sun') {
        // Sun is at the origin
        positionX = 0;
        positionY = 0;
        positionZ = 0;
        if (planetMesh) {
          planetMesh.rotation.y += planet.rotationSpeed * delta * 5; // Slow rotation for the sun
        }
      } else {
        try {
          const body = planet.name as Astronomy.BodyName; // Type assertion
          const vector = Astronomy.BodyVector(body, currentDate);
          const { x, y, z } = Astronomy.Equator(body, currentDate, vector, false);
          
          positionX = x * AU_TO_SCENE_SCALE;
          positionY = z * AU_TO_SCENE_SCALE; // Use z for y to align with orbital plane
          positionZ = -y * AU_TO_SCENE_SCALE; // Use -y for z for correct orientation

          if (planetMesh) {
            planetMesh.position.set(positionX, positionY, positionZ);
            planetMesh.rotation.y += planet.rotationSpeed * delta * 50; // Rotation speed scaled by delta
            if (planet.axialTilt) {
              planetMesh.rotation.x = (planet.axialTilt * Math.PI) / 180;
            }
          }
        } catch (error) {
          console.error(`Error calculating position for ${planet.name}:`, error);
          // Default to circular orbit if astronomy-engine fails or for planets without precise data
          const scaledOrbitRadius = (planet.realOrbitRadius / 149.6) * AU_TO_SCENE_SCALE; // Convert real orbit radius to AU then to scene scale
          const orbitalAngle = elapsedTime * (planet.orbitSpeed ?? 0.1); // Use a default if orbitSpeed is undefined
          positionX = scaledOrbitRadius * Math.sin(orbitalAngle);
          positionY = 0; // Planets orbit on the XZ plane
          positionZ = -scaledOrbitRadius * Math.cos(orbitalAngle);

          if (planetMesh) {
            planetMesh.position.set(positionX, positionY, positionZ);
            planetMesh.rotation.y += planet.rotationSpeed * delta * 50; // Apply axial rotation
            if (planet.axialTilt) {
              planetMesh.rotation.x = (planet.axialTilt * Math.PI) / 180;
            }
          }
        }
      }
      newPlanetPositions[planet.name] = [positionX, positionY, positionZ];

      // Clouds rotation (if applicable)
      const cloudsMesh = cloudsMeshRefs.current[index];
      if (cloudsMesh && planet.cloudSpeed) {
        cloudsMesh.rotation.y += planet.cloudSpeed * delta;
      }

      // Atmosphere pulse (if applicable)
      const atmosphereMesh = atmosphereMeshRefs.current[index];
      if (atmosphereMesh && planet.atmosphereColor) {
        const pulseFactor = 0.015 * Math.sin(elapsedTime * 0.5) + 1;
        atmosphereMesh.scale.set(pulseFactor, pulseFactor, pulseFactor);
      }

      // Handle moons for the current planet
      if (planet.moons) {
        planet.moons.forEach((moonData) => {
          const moonGlobalIndex = moonsData.findIndex(m => m.name === moonData.name && m.parentIndex === index);
          const moonMesh = moonMeshRefs.current[moonGlobalIndex];
          const parentCurrentPosition = newPlanetPositions[planet.name]; // Get current frame's parent position

          if (moonMesh && parentCurrentPosition) {
            const moonOrbitalAngle = elapsedTime * moonData.orbitSpeed; 
            const moonX = parentCurrentPosition[0] + moonData.orbitRadius * Math.cos(moonOrbitalAngle);
            const moonY = parentCurrentPosition[1]; // Keep moons on the same Y-plane as their planet for simplicity
            const moonZ = parentCurrentPosition[2] - moonData.orbitRadius * Math.sin(moonOrbitalAngle);
            
            moonMesh.position.set(moonX, moonY, moonZ);
            moonMesh.rotation.y += moonData.rotationSpeed * delta * 50;

            newPlanetPositions[moonData.name] = [moonX, moonY, moonZ];
          }
        });
      }
    });

    setAllPlanetPositions(newPlanetPositions);
  });

  // Calculate planet size dynamically
  const getPlanetSize = (planetName: string): number => {
    const data = planetData.find(p => p.name === planetName);
    return data ? scaleSize(data.realDiameter) : 1; // Default size if not found
  };
  
  // Track available advanced textures
  const normalMapIndex: {[key: string]: number} = {};
  const roughnessMapIndex: {[key: string]: number} = {};
  const cloudsMapIndex: {[key: string]: number} = {};
  
  // Initialize texture indices
  let normalMapCounter = 0;
  let roughnessMapCounter = 0;
  let cloudsMapCounter = 0;
  
  // Populate indices without conditionals
  planetData.forEach(planet => {
    if (planet.normalMap) {
      normalMapIndex[planet.name] = normalMapCounter++;
    }
    if (planet.roughnessMap) {
      roughnessMapIndex[planet.name] = roughnessMapCounter++;
    }
    if (planet.cloudsMap) {
      cloudsMapIndex[planet.name] = cloudsMapCounter++;
    }
  });

  // Debug log to check if Planets component renders
  console.log("Planets component rendering, selected:", selectedPlanet);

  return (
    <>
      {planetData.map((planet, index) => {
        const planetSize = getPlanetSize(planet.name);
        const hasNormalMap = planet.normalMap !== undefined && normalMapIndex[planet.name] !== undefined;
        const hasRoughnessMap = planet.roughnessMap !== undefined && roughnessMapIndex[planet.name] !== undefined;
        const hasCloudsMap = planet.cloudsMap !== undefined && cloudsMapIndex[planet.name] !== undefined;
        const hasAtmosphere = planet.atmosphereColor !== undefined;
        
        return (
          <React.Fragment key={planet.name}>
            {/* Main planet mesh */}
            <mesh
              ref={(el) => (planetMeshRefs.current[index] = el)}
              onClick={() => setSelectedPlanet(planet.name)}
              position={[planet.realOrbitRadius * AU_TO_SCENE_SCALE, 0, 0]} // Initial position
              castShadow={planet.name !== 'Sun'}
              receiveShadow={planet.name !== 'Sun'}
            >
              <sphereGeometry args={[planetSize, 64, 64]} />
              
              {planet.name === 'Sun' ? (
                // Sun uses emissive material
                <meshStandardMaterial
                  map={planetTextures[index]}
                  emissive={new Color(planet.color || '#FFFFFF')}
                  emissiveIntensity={sunEmissiveIntensity}
                  emissiveMap={planetTextures[index]}
                />
              ) : (
                // Other planets use physically-based materials - modified to handle missing textures
                <meshPhysicalMaterial
                  map={planetTextures[index]}
                  normalMap={hasNormalMap ? normalMaps[normalMapIndex[planet.name]] : null}
                  roughnessMap={hasRoughnessMap ? roughnessMaps[roughnessMapIndex[planet.name]] : null}
                  metalness={planet.name === 'Mercury' ? 0.6 : 0.2}
                  roughness={0.7}
                  clearcoat={planet.name === 'Earth' || planet.name === 'Venus' ? 0.2 : 0}
                  clearcoatRoughness={0.4}
                />
              )}
              
              {/* Glow effect for selected planet */}
              {selectedPlanet === planet.name && planet.name !== 'Sun' && (
                <mesh>
                  <sphereGeometry args={[planetSize * 1.2, 32, 32]} />
                  <meshStandardMaterial
                    color={new Color(planet.color || '#FFFFFF').multiplyScalar(1.5)}
                    transparent
                    opacity={0.3}
                    side={DoubleSide}
                    depthWrite={false}
                    emissive={new Color(planet.color || '#FFFFFF')}
                    emissiveIntensity={0.8}
                  />
                </mesh>
              )}
            </mesh>
            
            {/* Clouds layer for Earth-like planets */}
            {hasCloudsMap && (
              <mesh
                ref={(el) => (cloudsMeshRefs.current[index] = el)}
                position={[planet.realOrbitRadius * AU_TO_SCENE_SCALE, 0, 0]}
              >
                <sphereGeometry args={[planetSize * 1.02, 64, 64]} />
                <meshStandardMaterial
                  map={cloudsMaps[cloudsMapIndex[planet.name]]}
                  transparent
                  opacity={0.8}
                  depthWrite={false}
                  side={DoubleSide}
                />
              </mesh>
            )}
            
            {/* Atmosphere effect for planets with atmosphere */}
            {hasAtmosphere && planet.name !== 'Sun' && (
              <mesh
                ref={(el) => (atmosphereMeshRefs.current[index] = el)}
                position={[planet.realOrbitRadius * AU_TO_SCENE_SCALE, 0, 0]}
              >
                <sphereGeometry args={[planetSize * 1.1, 32, 32]} />
                <meshStandardMaterial
                  color={new Color(planet.atmosphereColor!)}
                  transparent
                  opacity={0.15}
                  side={DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            )}
            
            {/* Sun's constant glow */}
            {planet.name === 'Sun' && (
              <mesh 
                position={[0, 0, 0]}
              >
                <sphereGeometry args={[planetSize * 1.1, 64, 64]} />
                <meshStandardMaterial
                  color={new Color(planet.color || '#FFFFFF')}
                  transparent
                  opacity={0.3}
                  side={DoubleSide}
                  depthWrite={false}
                  emissive={new Color(planet.color || '#FFFFFF')}
                  emissiveIntensity={sunEmissiveIntensity * 0.8}
                />
              </mesh>
            )}
            
            {/* Render orbit line using realOrbitRadius for visual reference */}
            {planet.name !== 'Sun' && (
              <Orbit 
                radius={planet.realOrbitRadius * AU_TO_SCENE_SCALE} 
                color={planet.color ?? 'white'} 
                opacity={0.12} 
              />
            )}
          </React.Fragment>
        );
      })}

      {/* Saturn's Rings with improved material */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[getPlanetSize('Saturn') * 1.3, getPlanetSize('Saturn') * 2.2, 128]} />
        <meshPhysicalMaterial
          map={ringTexture}
          alphaMap={ringAlphaTexture}
          side={DoubleSide}
          transparent={true}
          opacity={0.9}
          alphaTest={0.2}
          roughness={0.7}
          metalness={0.2}
          clearcoat={0.1}
        />
      </mesh>

      {/* Render Moons with improved materials */}
      {moonsData.map((moon, index) => {
        const hasNormalMap = moon.normalMap !== undefined;
        
        return (
          <mesh
            key={`${moon.parentIndex}-${moon.name}`}
            ref={(el) => (moonMeshRefs.current[index] = el)}
            onClick={(e) => { e.stopPropagation(); setSelectedPlanet(moon.name); }}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[moon.size, 32, 32]} />
            <meshPhysicalMaterial 
              map={moonTextures[index]}
              normalMap={hasNormalMap ? moonNormalMaps[moonsData.findIndex(m => m.normalMap && m.name === moon.name)] : null}
              roughnessMap={moonRoughnessMaps[moonsData.findIndex(m => m.roughnessMap && m.name === moon.name)]}
              metalness={0.1}
              roughness={0.9}
            />
            
            {/* Glow effect for selected moon */}
            {selectedPlanet === moon.name && (
              <mesh>
                <sphereGeometry args={[moon.size * 1.3, 16, 16]} />
                <meshStandardMaterial
                  color={new Color('#CCCCCC')}
                  transparent
                  opacity={0.4}
                  side={DoubleSide}
                  depthWrite={false}
                  emissive={new Color('#FFFFFF')}
                  emissiveIntensity={0.5}
                />
              </mesh>
            )}
          </mesh>
        );
      })}
    </>
  );
};

export default Planets;
