// src/Orbit.tsx
import React from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface OrbitProps {
  radius: number;
}

const Orbit: React.FC<OrbitProps> = ({ radius }) => {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= 128; i++) {
    const angle = (i / 128) * Math.PI * 2;
    points.push([
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius,
    ]);
  }

  return (
    <Line
      points={points}
      color="white"
      lineWidth={0.5}
      dashed
      dashSize={0.5}
      gapSize={0.5}
    />
  );
};

export default Orbit;
