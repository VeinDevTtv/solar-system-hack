// src/Planets.tsx
import React, { useRef } from 'react';
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
  realOrbitRadius?: number; // in million km
}

interface PlanetData {
  name: string;
  texture: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  realOrbitRadius: number; // in million km
  moons?: MoonData[];
}

const planetData: PlanetData[] = [
  {
    name: 'Sun',
    texture: '/textures/sun.jpg',
    size: 4,
    orbitRadius: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.0007,
    realOrbitRadius: 0,
  },
  {
    name: 'Mercury',
    texture: '/textures/mercury.jpg',
    size: 0.5,
    orbitRadius: 8,
    orbitSpeed: 0.04,
    rotationSpeed: 0.004,
    realOrbitRadius: 57.9,
  },
  {
    name: 'Venus',
    texture: '/textures/venus.jpg',
    size: 0.95,
    orbitRadius: 12,
    orbitSpeed: 0.015,
    rotationSpeed: -0.002,
    realOrbitRadius: 108.2,
  },
  {
    name: 'Earth',
    texture: '/textures/earth.jpg',
    size: 1,
    orbitRadius: 16,
    orbitSpeed: 0.01,
    rotationSpeed: 0.02,
    realOrbitRadius: 149.6,
    moons: [
      {
        name: 'Moon',
        texture: '/textures/moon.jpg',
        size: 0.27,
        orbitRadius: 1.5,
        orbitSpeed: 0.05,
        realOrbitRadius: 0.384, // in million km
      },
    ],
  },
  {
    name: 'Mars',
    texture: '/textures/mars.jpg',
    size: 0.8,
    orbitRadius: 20,
    orbitSpeed: 0.008,
    rotationSpeed: 0.018,
    realOrbitRadius: 227.9,
    moons: [
      {
        name: 'Phobos',
        texture: '/textures/phobos.jpg',
        size: 0.1,
        orbitRadius: 1,
        orbitSpeed: 0.08,
        realOrbitRadius: 0.0094, // in million km
      },
      {
        name: 'Deimos',
        texture: '/textures/deimos.jpg',
        size: 0.08,
        orbitRadius: 1.3,
        orbitSpeed: 0.06,
        realOrbitRadius: 0.023, // in million km
      },
    ],
  },
  {
    name: 'Jupiter',
    texture: '/textures/jupiter.jpg',
    size: 2.5,
    orbitRadius: 30,
    orbitSpeed: 0.004,
    rotationSpeed: 0.04,
    realOrbitRadius: 778.6,
  },
  {
    name: 'Saturn',
    texture: '/textures/saturn.jpg',
    size: 2.2,
    orbitRadius: 40,
    orbitSpeed: 0.003,
    rotationSpeed: 0.038,
    realOrbitRadius: 1_433.5,
  },
  {
    name: 'Uranus',
    texture: '/textures/uranus.jpg',
    size: 1.5,
    orbitRadius: 50,
    orbitSpeed: 0.002,
    rotationSpeed: -0.03,
    realOrbitRadius: 2_872.5,
  },
  {
    name: 'Neptune',
    texture: '/textures/neptune.jpg',
    size: 1.5,
    orbitRadius: 60,
    orbitSpeed: 0.0018,
    rotationSpeed: 0.032,
    realOrbitRadius: 4_495.1,
  },
];

const Planets: React.FC = () => {
  const { setSelectedPlanet, setPlanetPosition } = usePlanetStore();

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

        // Optionally update moon positions in the store if needed
        // setPlanetPosition(moon.name, [
        //   moonMesh.position.x,
        //   moonMesh.position.y,
        //   moonMesh.position.z,
        // ]);
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

          {/* Add Rings to Saturn */}
          {planet.name === 'Saturn' && (
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planet.size * 1.4, planet.size * 2, 64]} />
              <meshStandardMaterial
                map={ringTexture}
                side={DoubleSide}
                transparent={true}
                opacity={0.8}
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
