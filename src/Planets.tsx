// src/Planets.tsx
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh } from 'three';
import { usePlanetStore } from './store';
import Orbit from './Orbit';

interface MoonData {
  name: string;
  texture: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
}

interface PlanetData {
  name: string;
  texture: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  moons?: MoonData[];
}

const planetData: PlanetData[] = [
  {
    name: 'Sun',
    texture: '/textures/sun.jpg',
    size: 5,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.0007,
  },
  {
    name: 'Mercury',
    texture: '/textures/mercury.jpg',
    size: 0.38,
    orbitRadius: 10,
    orbitSpeed: 0.04,
    rotationSpeed: 0.004,
  },
  {
    name: 'Venus',
    texture: '/textures/venus.jpg',
    size: 0.95,
    orbitRadius: 15,
    orbitSpeed: 0.015,
    rotationSpeed: -0.002,
  },
  {
    name: 'Earth',
    texture: '/textures/earth.jpg',
    size: 1,
    orbitRadius: 20,
    orbitSpeed: 0.01,
    rotationSpeed: 0.02,
    moons: [
      {
        name: 'Moon',
        texture: '/textures/moon.jpg',
        size: 0.27,
        orbitRadius: 2,
        orbitSpeed: 0.05,
      },
    ],
  },
  {
    name: 'Mars',
    texture: '/textures/mars.jpg',
    size: 0.53,
    orbitRadius: 25,
    orbitSpeed: 0.008,
    rotationSpeed: 0.018,
    moons: [
      {
        name: 'Phobos',
        texture: '/textures/phobos.jpg',
        size: 0.01,
        orbitRadius: 1,
        orbitSpeed: 0.08,
      },
      {
        name: 'Deimos',
        texture: '/textures/deimos.jpg',
        size: 0.006,
        orbitRadius: 1.5,
        orbitSpeed: 0.06,
      },
    ],
  },
  {
    name: 'Jupiter',
    texture: '/textures/jupiter.jpg',
    size: 11.21,
    orbitRadius: 35,
    orbitSpeed: 0.004,
    rotationSpeed: 0.04,
  },
  {
    name: 'Saturn',
    texture: '/textures/saturn.jpg',
    size: 9.45,
    orbitRadius: 45,
    orbitSpeed: 0.003,
    rotationSpeed: 0.038,
  },
  {
    name: 'Uranus',
    texture: '/textures/uranus.jpg',
    size: 4.01,
    orbitRadius: 55,
    orbitSpeed: 0.002,
    rotationSpeed: -0.03,
  },
  {
    name: 'Neptune',
    texture: '/textures/neptune.jpg',
    size: 3.88,
    orbitRadius: 65,
    orbitSpeed: 0.0018,
    rotationSpeed: 0.032,
  },
];

const Planets: React.FC = () => {
  const { setSelectedPlanet } = usePlanetStore();

  // Refs for planets
  const planetMeshRefs = useRef<Mesh[]>([]);
  const planetTextures = useLoader(
    TextureLoader,
    planetData.map((planet) => planet.texture)
  );

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
    const elapsedTime = state.clock.getElapsedTime();

    // Update planets
    planetData.forEach((planet, index) => {
      const mesh = planetMeshRefs.current[index];
      if (mesh) {
        // Rotate celestial body on its axis
        mesh.rotation.y += planet.rotationSpeed;

        // Planetary revolution around the Sun
        if (planet.name !== 'Sun') {
          const orbitRadius = planet.orbitRadius;
          const speed = planet.orbitSpeed;
          const angle = elapsedTime * speed;

          mesh.position.x = Math.cos(angle) * orbitRadius;
          mesh.position.z = Math.sin(angle) * orbitRadius;
        }
      }
    });

    // Update moons
    moonsData.forEach((moon, index) => {
      const moonMesh = moonMeshRefs.current[index];
      const parentMesh = planetMeshRefs.current[moon.parentIndex];

      if (moonMesh && parentMesh) {
        const angle = elapsedTime * moon.orbitSpeed;

        moonMesh.position.x =
          parentMesh.position.x + Math.cos(angle) * moon.orbitRadius;
        moonMesh.position.z =
          parentMesh.position.z + Math.sin(angle) * moon.orbitRadius;
        moonMesh.position.y = parentMesh.position.y;

        // Rotate moon on its axis
        moonMesh.rotation.y += 0.01;
      }
    });
  });

  return (
    <>
      {/* Render Planets */}
      {planetData.map((planet, index) => (
        <group key={planet.name}>
          {planet.name !== 'Sun' && <Orbit radius={planet.orbitRadius} />}
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
