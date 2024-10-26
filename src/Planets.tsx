// src/Planets.tsx
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader, Mesh } from 'three';
import { usePlanetStore } from './store';
import Orbit from './Orbit';

interface PlanetData {
  name: string;
  position: [number, number, number];
  texture: string;
  size: number;
  orbitSpeed: number;
  orbitRadius: number;
}

const planetData: PlanetData[] = [
  {
    name: 'Sun',
    position: [0, 0, 0],
    texture: '/textures/sun.jpg',
    size: 5,
    orbitSpeed: 0,
    orbitRadius: 0,
  },
  {
    name: 'Mercury',
    position: [10, 0, 0],
    texture: '/textures/mercury.jpg',
    size: 0.38,
    orbitSpeed: 0.02,
    orbitRadius: 10,
  },
  {
    name: 'Venus',
    position: [15, 0, 0],
    texture: '/textures/venus.jpg',
    size: 0.95,
    orbitSpeed: 0.015,
    orbitRadius: 15,
  },
  {
    name: 'Earth',
    position: [20, 0, 0],
    texture: '/textures/earth.jpg',
    size: 1,
    orbitSpeed: 0.01,
    orbitRadius: 20,
  },
  {
    name: 'Mars',
    position: [25, 0, 0],
    texture: '/textures/mars.jpg',
    size: 0.53,
    orbitSpeed: 0.008,
    orbitRadius: 25,
  },
  {
    name: 'Jupiter',
    position: [35, 0, 0],
    texture: '/textures/jupiter.jpg',
    size: 11.21,
    orbitSpeed: 0.005,
    orbitRadius: 35,
  },
  {
    name: 'Saturn',
    position: [45, 0, 0],
    texture: '/textures/saturn.jpg',
    size: 9.45,
    orbitSpeed: 0.004,
    orbitRadius: 45,
  },
  {
    name: 'Uranus',
    position: [55, 0, 0],
    texture: '/textures/uranus.jpg',
    size: 4.01,
    orbitSpeed: 0.003,
    orbitRadius: 55,
  },
  {
    name: 'Neptune',
    position: [65, 0, 0],
    texture: '/textures/neptune.jpg',
    size: 3.88,
    orbitSpeed: 0.002,
    orbitRadius: 65,
  },
];

const Planets: React.FC = () => {
  const { setSelectedPlanet } = usePlanetStore();
  const meshRefs = useRef<Mesh[]>([]);
  const textures = useLoader(
    TextureLoader,
    planetData.map((planet) => planet.texture)
  );

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    planetData.forEach((planet, index) => {
      const mesh = meshRefs.current[index];
      if (mesh) {
        // Rotate celestial body on its axis
        mesh.rotation.y += planet.name === 'Sun' ? 0.005 : 0.01;

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
  });

  return (
    <>
      {planetData.map((planet, index) => (
        <group key={planet.name}>
          {planet.name !== 'Sun' && <Orbit radius={planet.orbitRadius} />}
          <mesh
            ref={(el) => (meshRefs.current[index] = el!)}
            onClick={() => setSelectedPlanet(planet.name)}
            position={planet.name === 'Sun' ? planet.position : undefined}
          >
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial
              map={textures[index]}
              emissive={planet.name === 'Sun' ? 'yellow' : undefined}
              emissiveIntensity={planet.name === 'Sun' ? 1 : undefined}
            />
          </mesh>
        </group>
      ))}
    </>
  );
};

export default Planets;
