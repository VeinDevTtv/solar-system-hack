// src/store.ts
import { create } from 'zustand';

interface PlanetPosition {
  [planetName: string]: [number, number, number];
}

interface PlanetStore {
  selectedPlanet: string | null;
  targetPlanet: string | null;
  setSelectedPlanet: (planet: string) => void;
  setTargetPlanet: (planet: string | null) => void;
  planetPositions: PlanetPosition;
  setPlanetPosition: (planet: string, position: [number, number, number]) => void;
}

export const usePlanetStore = create<PlanetStore>((set) => ({
  selectedPlanet: null,
  targetPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  setTargetPlanet: (planet) => set({ targetPlanet: planet }),
  planetPositions: {},
  setPlanetPosition: (planet, position) =>
    set((state) => ({
      planetPositions: { ...state.planetPositions, [planet]: position },
    })),
}));
