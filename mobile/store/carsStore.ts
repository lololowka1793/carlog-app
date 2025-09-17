import { create } from 'zustand';
import { CarProfile } from '../models/carProfile';
import { loadData, saveData } from '../services/storage';

const KEY = 'cars';

interface CarsState {
  cars: CarProfile[];
  load: () => Promise<void>;
  add: (car: CarProfile) => Promise<void>;
  update: (car: CarProfile) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useCarsStore = create<CarsState>((set, get) => ({
  cars: [],
  load: async () => {
    const data = await loadData<CarProfile[]>(KEY);
    set({ cars: data ?? [] });
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
}));