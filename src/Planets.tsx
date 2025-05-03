// File Name: Planets.tsx
// Author: Abdelkarim
// Purpose: Renders all planets and moons, updates their positions, and handles interactions.
// Date: 10/26/2024

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh, DoubleSide } from 'three';
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
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  realOrbitRadius: number; // in million km
  realDiameter: number; // in km
  orbitalPeriod: number; // in Earth days
  axialTilt?: number; // in degrees
  eccentricity: number; // orbital eccentricity
  moons?: MoonData[];
}

// Constants for scale conversion
const SIZE_SCALE_FACTOR = 0.00003; // 1 km = 0.00003 scene units
const DISTANCE_SCALE_FACTOR = 0.03; // 1 million km = 0.03 scene units
const TIME_SCALE_FACTOR = 0.005; // Days to animation speed conversion

// Apply scale conversions to make visualization possible
const scaleSize = (realSizeKm: number) => Math.max(0.3, realSizeKm * SIZE_SCALE_FACTOR);
const scaleDistance = (realDistanceMKm: number) => realDistanceMKm * DISTANCE_SCALE_FACTOR;
const scaleSpeed = (orbitalPeriodDays: number) => (orbitalPeriodDays ? 2 * Math.PI / (orbitalPeriodDays * TIME_SCALE_FACTOR) : 0);
const scaleRotation = (rotationPeriodHours: number) => rotationPeriodHours ? 0.005 / rotationPeriodHours : 0;

// Exporting planetData
export const planetData: PlanetData[] = [
  {
    name: 'Sun',
    texture: '/textures/sun.jpg',
    size: scaleSize(1392000), // Diameter in km
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: scaleRotation(609.6), // Rotation period in hours
    realOrbitRadius: 0,
    realDiameter: 1392000,
    orbitalPeriod: 0,
    eccentricity: 0, // Sun doesn't orbit
  },
  {
    name: 'Mercury',
    texture: '/textures/mercury.jpg',
    size: scaleSize(4879),
    orbitRadius: scaleDistance(57.9),
    orbitSpeed: scaleSpeed(88),
    rotationSpeed: scaleRotation(1407.6), // 58.65 days
    realOrbitRadius: 57.9,
    realDiameter: 4879,
    orbitalPeriod: 88,
    axialTilt: 0.034,
    eccentricity: 0.2056,
  },
  {
    name: 'Venus',
    texture: '/textures/venus.jpg',
    size: scaleSize(12104),
    orbitRadius: scaleDistance(108.2),
    orbitSpeed: scaleSpeed(224.7),
    rotationSpeed: scaleRotation(-5832), // Retrograde rotation
    realOrbitRadius: 108.2,
    realDiameter: 12104,
    orbitalPeriod: 224.7,
    axialTilt: 177.4,
    eccentricity: 0.0067,
  },
  {
    name: 'Earth',
    texture: '/textures/earth.jpg',
    size: scaleSize(12756),
    orbitRadius: scaleDistance(149.6),
    orbitSpeed: scaleSpeed(365.2),
    rotationSpeed: scaleRotation(24),
    realOrbitRadius: 149.6,
    realDiameter: 12756,
    orbitalPeriod: 365.2,
    axialTilt: 23.4,
    eccentricity: 0.0167,
    moons: [
      {
        name: 'Moon',
        texture: '/textures/moon.jpg',
        size: scaleSize(3475),
        orbitRadius: scaleDistance(0.384),
        orbitSpeed: scaleSpeed(27.3),
        rotationSpeed: scaleRotation(655.2), // Tidally locked to Earth
        realOrbitRadius: 0.384,
        realDiameter: 3475,
        orbitalPeriod: 27.3,
      },
    ],
  },
  {
    name: 'Mars',
    texture: '/textures/mars.jpg',
    size: scaleSize(6792),
    orbitRadius: scaleDistance(227.9),
    orbitSpeed: scaleSpeed(687),
    rotationSpeed: scaleRotation(24.7),
    realOrbitRadius: 227.9,
    realDiameter: 6792,
    orbitalPeriod: 687,
    axialTilt: 25.2,
    eccentricity: 0.0935,
    moons: [
      {
        name: 'Phobos',
        texture: '/textures/phobos.jpg',
        size: scaleSize(22.2),
        orbitRadius: scaleDistance(0.0094),
        orbitSpeed: scaleSpeed(0.3189),
        rotationSpeed: scaleRotation(7.66), // Tidally locked to Mars
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
        rotationSpeed: scaleRotation(30.3), // Tidally locked to Mars
        realOrbitRadius: 0.0235,
        realDiameter: 12.6,
        orbitalPeriod: 1.263,
      },
    ],
  },
  {
    name: 'Jupiter',
    texture: '/textures/jupiter.jpg',
    size: scaleSize(142984),
    orbitRadius: scaleDistance(778.6),
    orbitSpeed: scaleSpeed(4333),
    rotationSpeed: scaleRotation(9.9),
    realOrbitRadius: 778.6,
    realDiameter: 142984,
    orbitalPeriod: 4333,
    axialTilt: 3.1,
    eccentricity: 0.0489,
  },
  {
    name: 'Saturn',
    texture: '/textures/saturn.jpg',
    size: scaleSize(120536),
    orbitRadius: scaleDistance(1433.5),
    orbitSpeed: scaleSpeed(10759),
    rotationSpeed: scaleRotation(10.7),
    realOrbitRadius: 1433.5,
    realDiameter: 120536,
    orbitalPeriod: 10759,
    axialTilt: 26.7,
    eccentricity: 0.0565,
  },
  {
    name: 'Uranus',
    texture: '/textures/uranus.jpg',
    size: scaleSize(51118),
    orbitRadius: scaleDistance(2872.5),
    orbitSpeed: scaleSpeed(30687),
    rotationSpeed: scaleRotation(-17.2), // Retrograde rotation
    realOrbitRadius: 2872.5,
    realDiameter: 51118,
    orbitalPeriod: 30687,
    axialTilt: 97.8,
    eccentricity: 0.0457,
  },
  {
    name: 'Neptune',
    texture: '/textures/neptune.jpg',
    size: scaleSize(49528),
    orbitRadius: scaleDistance(4495.1),
    orbitSpeed: scaleSpeed(60190),
    rotationSpeed: scaleRotation(16.1),
    realOrbitRadius: 4495.1,
    realDiameter: 49528,
    orbitalPeriod: 60190,
    axialTilt: 28.3,
    eccentricity: 0.0113,
  },
];

// Accept time scale from parent component
interface PlanetsProps {
  timeScale: number;
}

const Planets: React.FC<PlanetsProps> = ({ timeScale }) => {
  const { setSelectedPlanet, setPlanetPosition, selectedPlanet } = usePlanetStore();

  // Refs for planets
  const planetMeshRefs = useRef<Mesh[]>([]);
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
  const moonMeshRefs = useRef<Mesh[]>([]);
  const moonTextures = useLoader(
    TextureLoader,
    moonsData.map((moon) => moon.texture)
  );

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime() * timeScale;

    // Update planets
    planetData.forEach((planet, index) => {
      const mesh = planetMeshRefs.current[index];
      if (mesh) {
        // Apply axial tilt if defined
        if (planet.axialTilt && mesh.rotation.x === 0) {
          mesh.rotation.x = (planet.axialTilt * Math.PI) / 180;
        }

        // Rotate celestial body on its axis
        mesh.rotation.y += planet.rotationSpeed * timeScale;

        if (planet.name !== 'Sun') {
          const orbitRadius = planet.orbitRadius;
          const speed = planet.orbitSpeed;
          const angle = elapsedTime * speed;
          const eccentricity = planet.eccentricity;

          // Kepler's equation for elliptical orbits
          // r = a(1-e²)/(1+e·cos(θ)) where a is semi-major axis, e is eccentricity
          const distance = orbitRadius * (1 - eccentricity * eccentricity) / 
                          (1 + eccentricity * Math.cos(angle));

          mesh.position.x = Math.cos(angle) * distance;
          mesh.position.z = Math.sin(angle) * distance;
        }

        // Update the planet's position in the store
        setPlanetPosition(planet.name, [
          mesh.position.x,
          mesh.position.y,
          mesh.position.z,
        ]);
      }
    });

    // Update moons
    moonsData.forEach((moon, index) => {
      const moonMesh = moonMeshRefs.current[index];
      const parentMesh = planetMeshRefs.current[moon.parentIndex!];

      if (moonMesh && parentMesh) {
        const angle = elapsedTime * moon.orbitSpeed;

        moonMesh.position.x =
          parentMesh.position.x + Math.cos(angle) * moon.orbitRadius;
        moonMesh.position.z =
          parentMesh.position.z + Math.sin(angle) * moon.orbitRadius;
        moonMesh.position.y = parentMesh.position.y;

        // Rotate moon on its axis (many moons are tidally locked)
        moonMesh.rotation.y += moon.rotationSpeed * timeScale;

        // Update moon positions in the store
        setPlanetPosition(moon.name, [
          moonMesh.position.x,
          moonMesh.position.y,
          moonMesh.position.z,
        ]);
      }
    });
  });

  return (
    <>
      {/* Render Planets */}
      {planetData.map((planet, index) => (
        <group key={planet.name}>
          {planet.name !== 'Sun' && (
            <Orbit 
              radius={planet.orbitRadius} 
              eccentricity={planet.eccentricity}
              rotationAngle={0}
              color={planet.name === selectedPlanet ? "#64b5f6" : "white"}
            />
          )}
          <mesh
            ref={(el) => (planetMeshRefs.current[index] = el!)}
            onClick={() => setSelectedPlanet(planet.name)}
            position={planet.name === 'Sun' ? [0, 0, 0] : undefined}
          >
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial
              map={planetTextures[index]}
              emissive={planet.name === 'Sun' ? 'yellow' : undefined}
              emissiveIntensity={planet.name === 'Sun' ? 1 : undefined}
            />
          </mesh>

          {/* Add Rings to Saturn */}
          {planet.name === 'Saturn' && (
            <mesh rotation={[-Math.PI / 2 + ((planet.axialTilt || 0) * Math.PI) / 180, 0, 0]}>
              <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
              <meshStandardMaterial
                map={ringTexture}
                side={DoubleSide}
                transparent={true}
                opacity={0.8}
              />
            </mesh>
          )}
          
          {/* Add Rings to Uranus (fainter than Saturn's) */}
          {planet.name === 'Uranus' && (
            <mesh rotation={[-Math.PI / 2 + ((planet.axialTilt || 0) * Math.PI) / 180, 0, 0]}>
              <ringGeometry args={[planet.size * 1.3, planet.size * 1.8, 64]} />
              <meshStandardMaterial
                color="#d3d3d3"
                side={DoubleSide}
                transparent={true}
                opacity={0.4}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Render Moons */}
      {moonsData.map((moon, index) => (
        <mesh
          key={moon.name}
          ref={(el) => (moonMeshRefs.current[index] = el!)}
          onClick={() => setSelectedPlanet(moon.name)}
        >
          <sphereGeometry args={[moon.size, 16, 16]} />
          <meshStandardMaterial map={moonTextures[index]} />
        </mesh>
      ))}
    </>
  );
};

export default Planets;
