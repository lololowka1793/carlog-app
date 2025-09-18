// mobile/store/carsStore.ts
import { create } from 'zustand';
import type { CarProfile } from '../models/carProfile';
import * as carRepo from '../db/carRepo';

interface CarsState {
  cars: CarProfile[];
  activeCarId: string | null;

  load: () => Promise<void>;
  add: (car: Omit<CarProfile, 'id'> & { id?: string }) => Promise<void>;
  update: (car: CarProfile) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setActive: (id: string) => Promise<void>;
}

export const useCarsStore = create<CarsState>((set, get) => ({
  cars: [],
  activeCarId: null,

  load: async () => {
    const [cars, activeId] = await Promise.all([carRepo.list(), carRepo.getActiveId()]);
    set({ cars, activeCarId: activeId });
  },

  add: async (car) => {
    const toSave: CarProfile = { id: car.id ?? String(Date.now()), ...car };
    await carRepo.insert(toSave);
    await get().load();
  },

  update: async (car) => {
    await carRepo.update(car);
    await get().load();
  },

  remove: async (id) => {
    await carRepo.remove(id);
    await get().load();
  },

  setActive: async (id) => {
    await carRepo.setActive(id);
    await get().load();
  },
}));
