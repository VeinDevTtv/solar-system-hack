// src/Orbit.tsx
import React from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface OrbitProps {
  radius: number;
}

const Orbit: React.FC<OrbitProps> = ({ radius }) => {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    points.push([
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    ]);
  }

  return (
    <Line
      points={points}
      color="gray"
      lineWidth={1}
      dashed={false}
    />
  );
};

export default Orbit;
