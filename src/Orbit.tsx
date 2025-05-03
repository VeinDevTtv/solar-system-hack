// src/Orbit.tsx
import React from 'react';
import { Line, Sphere } from '@react-three/drei';
import { Vector3 } from 'three';

interface OrbitProps {
  radius: number;
  eccentricity?: number;
  rotationAngle?: number; // In radians
  color?: string;
  showFoci?: boolean;
}

const Orbit: React.FC<OrbitProps> = ({ 
  radius, 
  eccentricity = 0, 
  rotationAngle = 0,
  color = "white",
  showFoci = true
}) => {
  // Calculate semi-minor axis from eccentricity and semi-major axis
  const semiMajorAxis = radius;
  const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - (eccentricity * eccentricity));
  
  // Calculate focus distance from center
  const focusDistance = eccentricity * semiMajorAxis;
  
  const points: [number, number, number][] = [];
  const segments = 256; // More segments for smoother orbits
  
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
  
  // Calculate perihelion point (closest to Sun)
  const perihelionX = -semiMajorAxis * (1 - eccentricity);
  const perihelionZ = 0;
  
  // Calculate aphelion point (farthest from Sun)
  const aphelionX = semiMajorAxis * (1 + eccentricity);
  const aphelionZ = 0;
  
  // Create lighter color for focus points
  const getFocusColor = (baseColor: string): string => {
    // For white, return a pale blue
    if (baseColor === "white") return "#aaccff";
    
    // Otherwise brighten the base color by mixing with white
    return baseColor;
  };

  return (
    <>
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
      
      {/* Display foci points if requested and if the orbit is elliptical */}
      {showFoci && eccentricity > 0.01 && (
        <>
          {/* Perihelion marker (closest to sun) */}
          <Sphere 
            args={[0.15, 8, 8]}
            position={[perihelionX, 0, perihelionZ]}
          >
            <meshBasicMaterial color={getFocusColor(color)} transparent opacity={0.7} />
          </Sphere>
          
          {/* Aphelion marker (farthest from sun) */}
          <Sphere 
            args={[0.15, 8, 8]} 
            position={[aphelionX, 0, aphelionZ]}
          >
            <meshBasicMaterial color={getFocusColor(color)} transparent opacity={0.7} />
          </Sphere>
        </>
      )}
    </>
  );
};

export default Orbit;
