// mobile/store/carsStore.ts
import { create } from 'zustand';
import type { CarProfile } from '../models/carProfile';
import { loadData, saveData } from '../services/storage';

const KEY = 'cars';

interface CarsState {
  cars: CarProfile[];
  activeCarId: string | null;
  load: () => Promise<void>;
  add: (car: CarProfile) => Promise<void>;
  update: (car: CarProfile) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setActive: (id: string) => void;
}

export const useCarsStore = create<CarsState>((set, get) => ({
  cars: [],
  activeCarId: null,

  load: async () => {
    const data = await loadData(KEY);
    set({ cars: (data ?? []) as CarProfile[] });   // <-- явное приведение
  },

  add: async (car) => {
    const next = [...get().cars, car];
    await saveData(KEY, next);
    set({ cars: next });
  },

  update: async (car) => {
    const next = get().cars.map(c => c.id === car.id ? car : c);
    await saveData(KEY, next);
    set({ cars: next });
  },

  remove: async (id) => {
    const next = get().cars.filter(c => c.id !== id);
    await saveData(KEY, next);
    set({ cars: next });
  },

  setActive: (id) => set({ activeCarId: id }),
}));
