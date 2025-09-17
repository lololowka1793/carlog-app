import { create } from 'zustand';
import { CarProfile } from '../models/carProfile';
import { saveData, loadData } from '../services/storage';

interface ProfileState {
  profile: CarProfile | null;
  loadProfile: () => Promise<void>;
  setProfile: (p: CarProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  loadProfile: async () => {
    const data = await loadData<CarProfile>('carProfile');
    if (data) set({ profile: data });
  },
  setProfile: async (p) => {
    await saveData('carProfile', p);
    set({ profile: p });
  },
  clearProfile: async () => {
    await saveData('carProfile', null as any);
    set({ profile: null });
  },
}));
