// File Name: Orbit.tsx
// Author: Abdelkarim
// Purpose: Renders orbit lines for planets.
// Date: 10/26/2024

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';

interface OrbitProps {
  radius: number;
  color?: string;
  opacity?: number;
  lineWidth?: number;
}

const Orbit: React.FC<OrbitProps> = ({ 
  radius, 
  color = 'white', 
  opacity = 0.15, 
  lineWidth = 1 
}) => {
  // Generate orbit circle points with memoization
  const points = useMemo(() => {
    const segments = 128; // Number of segments in the orbit circle
    const tempPoints = [];
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      tempPoints.push([x, 0, z] as [number, number, number]);
    }
    
    return tempPoints;
  }, [radius]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={lineWidth}
      transparent
      opacity={opacity}
    />
  );
};

export default Orbit;
