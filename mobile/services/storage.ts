// mobile/services/storage.ts (как прежде)
import AsyncStorage from '@react-native-async-storage/async-storage';
export async function saveData<T>(key: string, value: T) { await AsyncStorage.setItem(key, JSON.stringify(value)); }
export async function loadData<T>(key: string) { const raw = await AsyncStorage.getItem(key); return raw ? JSON.parse(raw) as T : null; }