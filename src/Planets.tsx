// File Name: Planets.tsx
// Author: Abdelkarim
// Purpose: Renders all planets and moons, updates their positions, and handles interactions.
// Date: 10/26/2024

import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, DoubleSide, Color } from 'three';
import * as Astronomy from 'astronomy-engine'; // Import the library
import { usePlanetStore } from './store';
import Orbit from './Orbit';

interface MoonData {
  name: string;
  texture: string;
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
  },
  {
    name: 'Earth',
    texture: '/textures/earth.jpg',
    rotationSpeed: scaleRotation(24),
    realOrbitRadius: 149.6,
    realDiameter: 12756,
    axialTilt: 23.4,
    color: '#2E5F98',
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
  },
  {
    name: 'Saturn',
    texture: '/textures/saturn.jpg',
    rotationSpeed: scaleRotation(10.7),
    realOrbitRadius: 1433.5,
    realDiameter: 120536,
    axialTilt: 26.7,
    color: '#EACE87',
  },
  {
    name: 'Uranus',
    texture: '/textures/uranus.jpg',
    rotationSpeed: scaleRotation(-17.2),
    realOrbitRadius: 2872.5,
    realDiameter: 51118,
    axialTilt: 97.8,
    color: '#D1E7E7',
  },
  {
    name: 'Neptune',
    texture: '/textures/neptune.jpg',
    rotationSpeed: scaleRotation(16.1),
    realOrbitRadius: 4495.1,
    realDiameter: 49528,
    axialTilt: 28.3,
    color: '#3E66F9',
  },
];

// Accept currentDate from parent component
interface PlanetsProps {
  currentDate: Date;
  sunEmissiveIntensity?: number; // Added prop for sun's emissive intensity
}

const Planets: React.FC<PlanetsProps> = ({ currentDate, sunEmissiveIntensity = 1.5 }) => {
  const { setSelectedPlanet, setPlanetPosition, selectedPlanet } = usePlanetStore();

  // Refs for planets
  const planetMeshRefs = useRef<(Mesh | null)[]>([]); // Allow null refs initially
  const planetTextures = useLoader(
    TextureLoader,
    planetData.map((planet) => planet.texture)
  );

  // Load the ring texture for Saturn's rings
  const ringTexture = useLoader(TextureLoader, '/textures/saturn_ring.png');

  // Prepare moon data
  const moonsData = planetData.flatMap((planet, pIndex) =>
    planet.moons?.map((moon) => ({
      ...moon,
      parentIndex: pIndex,
    })) || []
  );

  // Refs and textures for moons
  const moonMeshRefs = useRef<(Mesh | null)[]>([]); // Allow null refs initially
  const moonTextures = useLoader(
    TextureLoader,
    moonsData.map((moon) => moon.texture)
  );

  // Ring ref for Saturn
  const ringRef = useRef<Mesh>(null);

  // Simplified calculateOrbitalPosition for moons (relative to parent) - KEEP for moons for now
  const calculateMoonPosition = (
    orbitRadius: number,
    orbitSpeed: number,
    elapsedTime: number
  ): [number, number, number] => {
    const angle = elapsedTime * orbitSpeed * 0.1; // Apply a factor if needed
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;
    return [x, 0, z]; // Assume moons orbit in the same plane as planets for now
  };

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();

    planetData.forEach((planet, index) => {
      const mesh = planetMeshRefs.current[index];
      if (!mesh) return;

      if (planet.name !== 'Sun') {
        try {
          // Ensure planet name is a valid Astronomy.Body type
          const bodyName = planet.name as keyof typeof Astronomy.Body;
          if (!(bodyName in Astronomy.Body)) {
            console.warn(`Invalid body name for Astronomy Engine: ${planet.name}`);
            return; // Skip this planet if name is invalid
          }

          const helioVector = Astronomy.HelioVector(Astronomy.Body[bodyName], currentDate);

          const positionX = helioVector.x * AU_TO_SCENE_SCALE;
          const positionY = helioVector.z * AU_TO_SCENE_SCALE;
          const positionZ = helioVector.y * AU_TO_SCENE_SCALE;

          mesh.position.set(positionX, positionY, positionZ);

          // Update store with position as an array [x, y, z]
           setPlanetPosition(planet.name, [positionX, positionY, positionZ]);

        } catch (error) {
          console.error(`Error calculating position for ${planet.name}:`, error);
        }
      }

      // --- Rotation ---
      mesh.rotation.y += (planet.rotationSpeed || 0) * delta * 50;

      // Apply axial tilt - Placeholder for complex rotation logic
      // if (planet.axialTilt !== undefined) {
      //   // Requires Quaternion logic for correct application relative to orbit
      // }

      // --- Handle Saturn's Rings ---
      if (planet.name === 'Saturn' && ringRef.current) {
        ringRef.current.position.copy(mesh.position);
        // Simple tilt for now - ideally align with planet's true tilt
        ringRef.current.rotation.x = Math.PI / 2 + (planet.axialTilt || 0) * (Math.PI / 180);
        // Let rings spin with planet for now
        ringRef.current.rotation.y = mesh.rotation.y;
      }

      // --- Handle Moons (using old simplified logic) ---
      if (planet.moons) {
        planet.moons.forEach((moon) => {
          const moonIndex = moonsData.findIndex(m => m.name === moon.name && m.parentIndex === index);
          const moonMesh = moonMeshRefs.current[moonIndex];
          if (!moonMesh || !moon.orbitRadius || !moon.orbitSpeed || !moon.rotationSpeed) return; // Check moon data

          const [moonX, moonY, moonZ] = calculateMoonPosition(
            moon.orbitRadius,
            moon.orbitSpeed,
            elapsedTime
          );

          moonMesh.position.set(
            mesh.position.x + moonX,
            mesh.position.y + moonY,
            mesh.position.z + moonZ
          );

          moonMesh.rotation.y += moon.rotationSpeed * delta * 50;
        });
      }
    });
  });

  // Calculate planet size dynamically
  const getPlanetSize = (planetName: string): number => {
    const data = planetData.find(p => p.name === planetName);
    return data ? scaleSize(data.realDiameter) : 1; // Default size if not found
  };

  return (
    <>
      {planetData.map((planet, index) => {
         const planetSize = getPlanetSize(planet.name);
        return (
          <React.Fragment key={planet.name}>
            <mesh
              ref={(el) => (planetMeshRefs.current[index] = el)}
              onClick={() => setSelectedPlanet(planet.name)}
              position={[planet.realOrbitRadius * AU_TO_SCENE_SCALE, 0, 0]} // Initial placeholder position (will be updated by useFrame)
            >
              <sphereGeometry args={[planetSize, 32, 32]} />
              <meshStandardMaterial
                map={planetTextures[index]}
                metalness={0.4}
                roughness={0.7}
                emissive={planet.name === 'Sun' ? new Color(planet.color || '#FFFFFF') : new Color(0x000000)}
                emissiveIntensity={planet.name === 'Sun' ? sunEmissiveIntensity : 0}
              />
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
               {/* Sun's constant glow */}
              {planet.name === 'Sun' && (
                 <mesh>
                   <sphereGeometry args={[planetSize * 1.1, 48, 48]} />
                   <meshStandardMaterial
                     color={new Color(planet.color || '#FFFFFF')}
                     transparent
                     opacity={0.25}
                     side={DoubleSide}
                     depthWrite={false}
                     emissive={new Color(planet.color || '#FFFFFF')}
                     emissiveIntensity={sunEmissiveIntensity * 0.8} // Adjust intensity based on prop
                   />
                 </mesh>
              )}
            </mesh>
            {/* Render orbit line using realOrbitRadius for visual reference */}
             {planet.name !== 'Sun' && <Orbit radius={planet.realOrbitRadius * AU_TO_SCENE_SCALE} />}
          </React.Fragment>
        );
      })}

      {/* Saturn's Rings */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[getPlanetSize('Saturn') * 1.3, getPlanetSize('Saturn') * 2.2, 64]} />
        <meshStandardMaterial
          map={ringTexture}
          side={DoubleSide}
          transparent={true}
          opacity={0.8}
          alphaTest={0.5} // Adjust alphaTest for better transparency handling
        />
      </mesh>

      {/* Render Moons */}
      {moonsData.map((moon, index) => (
        <mesh
          key={`${moon.parentIndex}-${moon.name}`}
          ref={(el) => (moonMeshRefs.current[index] = el)}
           onClick={(e) => { e.stopPropagation(); setSelectedPlanet(moon.name); }} // Select moon on click
          // Initial position will be updated by useFrame relative to parent
        >
          <sphereGeometry args={[moon.size, 16, 16]} />
          <meshStandardMaterial map={moonTextures[index]} metalness={0.2} roughness={0.8}/>
            {/* Glow effect for selected moon */}
           {selectedPlanet === moon.name && (
             <mesh>
               <sphereGeometry args={[moon.size * 1.3, 16, 16]} />
               <meshStandardMaterial
                 color={new Color('#CCCCCC')} // Generic glow for moons
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
      ))}
    </>
  );
};

export default Planets;
