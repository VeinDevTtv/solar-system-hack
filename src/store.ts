// src/store.ts
import { create } from 'zustand';

interface PlanetStore {
  selectedPlanet: string | null;
  setSelectedPlanet: (name: string) => void;
}

export const usePlanetStore = create<PlanetStore>((set) => ({
  selectedPlanet: null,
  setSelectedPlanet: (name) => set({ selectedPlanet: name }),
}));
