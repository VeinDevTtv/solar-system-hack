// src/Orbit.tsx
import React from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface OrbitProps {
  radius: number;
  eccentricity?: number;
  rotationAngle?: number; // In radians
  color?: string;
}

const Orbit: React.FC<OrbitProps> = ({ 
  radius, 
  eccentricity = 0, 
  rotationAngle = 0,
  color = "white" 
}) => {
  // Calculate semi-minor axis from eccentricity and semi-major axis
  const semiMajorAxis = radius;
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - (eccentricity * eccentricity));
  
  const points: [number, number, number][] = [];
  const segments = 128;
  
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    
    // Parametric equation of ellipse
    const x = Math.cos(angle) * semiMajorAxis;
    const z = Math.sin(angle) * semiMinorAxis;
    
    // Apply rotation if specified
    if (rotationAngle !== 0) {
      const cosRot = Math.cos(rotationAngle);
      const sinRot = Math.sin(rotationAngle);
      
      // Rotation matrix application
      const rotatedX = x * cosRot - z * sinRot;
      const rotatedZ = x * sinRot + z * cosRot;
      
      points.push([rotatedX, 0, rotatedZ]);
    } else {
      points.push([x, 0, z]);
    }
  }

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      dashed
      dashSize={0.5}
      gapSize={0.5}
      transparent
      opacity={0.6}
    />
  );
};

export default Orbit;
