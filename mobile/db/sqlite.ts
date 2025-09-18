// mobile/db/sqlite.ts
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

let _db: SQLite.SQLiteDatabase | null = null;

async function ensureSQLiteDir() {
  // В Expo/Android нормальная база лежит в <documentDirectory>/SQLite.
  // Но в некоторых версиях typings TS "не видит" documentDirectory.
  // Берём documentDirectory, а если его нет в рантайме/типах — cacheDirectory.
  const docDir = (FileSystem as any).documentDirectory as string | null | undefined;
  const baseDir = docDir ?? FileSystem.cacheDirectory; // оба дают строку на native
  if (!baseDir) return; // (на web sqlite всё равно не работает)

  const dir = baseDir + 'SQLite';

  // Если по этому пути почему-то лежит ФАЙЛ, а не папка — удалим и создадим папку
  const info = await FileSystem.getInfoAsync(dir);
  if (info.exists && !info.isDirectory) {
    await FileSystem.deleteAsync(dir, { idempotent: true });
  }
  const again = await FileSystem.getInfoAsync(dir);
  if (!again.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function getDb() {
  if (_db) return _db;

  // На web sqlite не поддерживается — просто выходим без подготовки пути
  if (Platform.OS !== 'web') {
    await ensureSQLiteDir();
  }

  _db = await SQLite.openDatabaseAsync('carlog.db');
  await _db.execAsync('PRAGMA foreign_keys = ON;');

  // --- схемы ---
  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      transport TEXT NOT NULL,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      plate TEXT NOT NULL,
      year INTEGER,
      unit TEXT NOT NULL,
      vin TEXT,
      odometer REAL NOT NULL,
      fuel TEXT NOT NULL,
      tanks TEXT NOT NULL,
      isActive INTEGER NOT NULL DEFAULT 0
    );
  `);

  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS fuel_entries (
      id TEXT PRIMARY KEY,
      carId TEXT NOT NULL,
      date TEXT NOT NULL,
      odometer REAL NOT NULL,
      liters REAL NOT NULL,
      pricePerLiter REAL NOT NULL,
      totalCost REAL NOT NULL,
      isFullTank INTEGER NOT NULL,
      FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
    );
  `);

  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS service_entries (
      id TEXT PRIMARY KEY,
      carId TEXT NOT NULL,
      date TEXT NOT NULL,
      odometer REAL NOT NULL,
      type TEXT NOT NULL,
      cost REAL NOT NULL,
      notes TEXT,
      FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
    );
  `);

  return _db;
}
