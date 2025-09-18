// mobile/store/fuelStore.ts
import { create } from 'zustand';
import type { FuelEntry } from '../models/fuelEntry';
import * as fuelRepo from '../db/fuelRepo';
import * as carRepo from '../db/carRepo';

interface FuelState {
  entries: FuelEntry[];
  load: (carId: string | null) => Promise<void>;
  add: (entry: Omit<FuelEntry, 'id'> & { id?: string }) => Promise<void>;
  update: (entry: FuelEntry) => Promise<void>;
  remove: (id: string, carId: string | null) => Promise<void>;
}

export const useFuelStore = create<FuelState>((set, get) => ({
  entries: [],

  load: async (carId) => {
    if (!carId) { set({ entries: [] }); return; }
    const list = await fuelRepo.listByCar(carId);
    set({ entries: list });
  },

  add: async (entry) => {
    const toSave: FuelEntry = { id: entry.id ?? String(Date.now()), ...entry };
    await fuelRepo.insert(toSave);

    // обновляем одометр машины, если вырос
    await carRepo.updateOdometerIfHigher(toSave.carId, toSave.odometer);

    await get().load(entry.carId);
  },

  update: async (entry) => {
    await fuelRepo.update(entry);
    await get().load(entry.carId);
  },

  remove: async (id, carId) => {
    await fuelRepo.remove(id);
    await get().load(carId ?? null);
  },
}));
