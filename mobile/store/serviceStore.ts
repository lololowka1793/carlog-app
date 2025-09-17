// mobile/store/serviceStore.ts
import { create } from 'zustand';
import type { ServiceEntry } from '../models/serviceEntry';
import { loadData, saveData } from '../services/storage';

const KEY = 'serviceEntries';

interface ServiceState {
  entries: ServiceEntry[];
  load: () => Promise<void>;
  add: (entry: ServiceEntry) => Promise<void>;
  update: (entry: ServiceEntry) => Promise<void>;
  remove: (id: string) => Promise<void>;
  getByCarId: (carId: string) => ServiceEntry[];
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  entries: [],

  load: async () => {
    const data = await loadData(KEY);
    set({ entries: (data ?? []) as ServiceEntry[] }); // <-- явное приведение
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
