import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { usePlanetStore } from '../store';

const FreeFlightControls: React.FC = () => {
  const { camera } = useThree();
  const { settings } = usePlanetStore();
  
  // Track key states
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  
  // Movement vectors
  const velocity = useRef<Vector3>(new Vector3());
  const direction = useRef<Vector3>(new Vector3());
  
  // Initialize keys tracking
  useEffect(() => {
    // Set up key listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      // Convert to lowercase to make case-insensitive
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Convert to lowercase to make case-insensitive
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Handle movement
  useFrame((_, delta) => {
    // Skip if free camera is disabled
    if (!settings.freeCamera) return;
    
    // Access key bindings from settings
    const { keyBindings, movementSpeed } = settings;
    
    // Reset direction
    direction.current.set(0, 0, 0);
    
    // Speed multiplier for boost
    const speedMultiplier = keysPressed.current[keyBindings.speedBoost.toLowerCase()] ? 2 : 1;
    
    // Forward/backward
    if (keysPressed.current[keyBindings.moveForward.toLowerCase()]) {
      direction.current.z -= 1;
    }
    if (keysPressed.current[keyBindings.moveBackward.toLowerCase()]) {
      direction.current.z += 1;
    }
    
    // Left/right
    if (keysPressed.current[keyBindings.moveLeft.toLowerCase()]) {
      direction.current.x -= 1;
    }
    if (keysPressed.current[keyBindings.moveRight.toLowerCase()]) {
      direction.current.x += 1;
    }
    
    // Up/down
    if (keysPressed.current[keyBindings.moveUp.toLowerCase()]) {
      direction.current.y += 1;
    }
    if (keysPressed.current[keyBindings.moveDown.toLowerCase()]) {
      direction.current.y -= 1;
    }
    
    // Normalize direction if moving in multiple directions
    if (direction.current.lengthSq() > 0) {
      direction.current.normalize();
    }
    
    // Calculate velocity
    const actualSpeed = movementSpeed * speedMultiplier * delta * 50;
    
    // Update velocity with direction and speed
    velocity.current.copy(direction.current).multiplyScalar(actualSpeed);
    
    // Move the camera in local space (relative to camera orientation)
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Calculate forward and right vectors
    const forward = cameraDirection.clone();
    const right = forward.clone().cross(new Vector3(0, 1, 0)).normalize();
    const up = right.clone().cross(forward).normalize();
    
    // Calculate final movement vector
    const movement = new Vector3();
    
    // Add movement components
    if (velocity.current.z !== 0) {
      movement.add(forward.clone().multiplyScalar(-velocity.current.z));
    }
    
    if (velocity.current.x !== 0) {
      movement.add(right.clone().multiplyScalar(velocity.current.x));
    }
    
    if (velocity.current.y !== 0) {
      movement.add(up.clone().multiplyScalar(velocity.current.y));
    }
    
    // Apply movement
    camera.position.add(movement);
  });
  
  return null; // This component doesn't render anything
};

export default FreeFlightControls; 