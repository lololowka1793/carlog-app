// mobile/store/fuelStore.ts
import { create } from 'zustand';
import type { FuelEntry } from '../models/fuelEntry';
import { loadData, saveData } from '../services/storage';

const KEY = 'fuelEntries';

interface FuelState {
  entries: FuelEntry[];
  load: () => Promise<void>;
  add: (entry: FuelEntry) => Promise<void>;
  update: (entry: FuelEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getByCarId: (carId: string) => FuelEntry[];
}

export const useFuelStore = create<FuelState>((set, get) => ({
  entries: [],

  load: async () => {
    const data = await loadData(KEY);
    set({ entries: (data ?? []) as FuelEntry[] }); // <-- явное приведение
  },

  add: async (entry) => {
    const next = [...get().entries, entry];
    await saveData(KEY, next);
    set({ entries: next });
  },

  update: async (entry) => {
    const next = get().entries.map(e => e.id === entry.id ? entry : e);
    await saveData(KEY, next);
    set({ entries: next });
  },

  remove: async (id) => {
    const next = get().entries.filter(e => e.id !== id);
    await saveData(KEY, next);
    set({ entries: next });
  },

  getByCarId: (carId) => get().entries.filter(e => e.carId === carId),
}));
