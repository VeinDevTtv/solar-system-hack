// File Name: store.ts
// Author: Abdelkarim
// Purpose: Manages global state using Zustand for selected planet, target planet, and planet positions.
// Date: 10/26/2024

import { create } from 'zustand';

interface PlanetPosition {
  [planetName: string]: [number, number, number];
}

// Default key bindings
export const DEFAULT_KEYBINDINGS = {
  moveForward: 'w',
  moveBackward: 's',
  moveLeft: 'a',
  moveRight: 'd',
  moveUp: ' ', // space
  moveDown: 'shift',
  speedBoost: 'control',
};

// Settings types
export interface KeyBindings {
  moveForward: string;
  moveBackward: string;
  moveLeft: string;
  moveRight: string;
  moveUp: string;
  moveDown: string;
  speedBoost: string;
}

export interface Settings {
  keyBindings: KeyBindings;
  movementSpeed: number;
  mouseSensitivity: number;
  invertY: boolean;
  freeCamera: boolean;
}

// Combined store interface
interface PlanetStore {
  // Planet selection and positions
  selectedPlanet: string | null;
  targetPlanet: string | null;
  setSelectedPlanet: (planet: string | null) => void;
  setTargetPlanet: (planet: string | null) => void;
  planetPositions: PlanetPosition;
  setPlanetPosition: (planet: string, position: [number, number, number]) => void;
  
  // Settings and controls
  settings: Settings;
  updateKeyBinding: (key: keyof KeyBindings, value: string) => void;
  updateMovementSpeed: (speed: number) => void;
  updateMouseSensitivity: (sensitivity: number) => void;
  toggleInvertY: () => void;
  toggleFreeCamera: () => void;
  resetKeyBindings: () => void;
}

// Create store without persistence for now to debug issues
export const usePlanetStore = create<PlanetStore>((set) => ({
  // Planet selection and positions
  selectedPlanet: null,
  targetPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  setTargetPlanet: (planet) => set({ targetPlanet: planet }),
  planetPositions: {},
  setPlanetPosition: (planet, position) =>
    set((state) => ({
      planetPositions: { ...state.planetPositions, [planet]: position },
    })),
  
  // Settings with defaults
  settings: {
    keyBindings: { ...DEFAULT_KEYBINDINGS },
    movementSpeed: 1.0,
    mouseSensitivity: 1.0,
    invertY: false,
    freeCamera: false,
  },
  
  // Settings update functions
  updateKeyBinding: (key, value) => 
    set((state) => ({
      settings: {
        ...state.settings,
        keyBindings: {
          ...state.settings.keyBindings,
          [key]: value,
        }
      }
    })),
  
  updateMovementSpeed: (speed) => 
    set((state) => ({
      settings: {
        ...state.settings,
        movementSpeed: speed,
      }
    })),
  
  updateMouseSensitivity: (sensitivity) => 
    set((state) => ({
      settings: {
        ...state.settings,
        mouseSensitivity: sensitivity,
      }
    })),
  
  toggleInvertY: () => 
    set((state) => ({
      settings: {
        ...state.settings,
        invertY: !state.settings.invertY,
      }
    })),
  
  toggleFreeCamera: () => {
    console.log("Toggling free camera");
    return set((state) => ({
      settings: {
        ...state.settings,
        freeCamera: !state.settings.freeCamera,
      }
    }));
  },
  
  resetKeyBindings: () => 
    set((state) => ({
      settings: {
        ...state.settings,
        keyBindings: { ...DEFAULT_KEYBINDINGS },
      }
    })),
}));
