// mobile/db/sqlite.ts
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

let _db: SQLite.SQLiteDatabase | null = null;

// Универсальный раннер: ловим текст ошибки и печатаем SQL
async function run(db: SQLite.SQLiteDatabase, sql: string, params: any[] = []) {
  try {
    // гарантируем, что нет undefined в параметрах (Android падал на prepare)
    const safe = params.map((p) => (p === undefined ? null : p));
    await db.runAsync(sql, safe);
  } catch (e) {
    console.warn('[SQL runAsync error]', sql, params, e);
    throw e;
  }
}
async function getAll<T = any>(db: SQLite.SQLiteDatabase, sql: string, params: any[] = []) {
  try {
    const safe = params.map((p) => (p === undefined ? null : p));
    return (await db.getAllAsync<T>(sql, safe)) as T[];
  } catch (e) {
    console.warn('[SQL getAllAsync error]', sql, params, e);
    throw e;
  }
}
async function getFirst<T = any>(db: SQLite.SQLiteDatabase, sql: string, params: any[] = []) {
  const rows = await getAll<T>(db, sql, params);
  return (rows as any[])[0] ?? null;
}

async function ensureSQLiteDir() {
  // documentDirectory может быть не в typings → берём через any, fallback на cacheDirectory
  const docDir = (FileSystem as any).documentDirectory as string | null | undefined;
  const cacheDir = (FileSystem as any).cacheDirectory as string | null | undefined;
  const baseDir = docDir ?? cacheDir;
  if (!baseDir) return; // web

  const dir = baseDir + 'SQLite';
  const info = await FileSystem.getInfoAsync(dir);
  if (info.exists && !info.isDirectory) {
    await (FileSystem as any).deleteAsync(dir, { idempotent: true });
  }
  const again = await FileSystem.getInfoAsync(dir);
  if (!again.exists) {
    await (FileSystem as any).makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function getDb() {
  if (_db) return _db;

  if (Platform.OS !== 'web') {
    await ensureSQLiteDir();
  }

  _db = await SQLite.openDatabaseAsync('carlog.db');

  // базовыеpragma
  await _db.execAsync('PRAGMA foreign_keys = ON;');
  await _db.execAsync('PRAGMA journal_mode = WAL;');

  // ВНИМАНИЕ: без комментариев/русских символов в SQL — Expo Android иногда падал на prepare
  await run(
    _db,
    `CREATE TABLE IF NOT EXISTS cars (
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
    );`
  );

  await run(
    _db,
    `CREATE TABLE IF NOT EXISTS fuel_entries (
      id TEXT PRIMARY KEY,
      carId TEXT NOT NULL,
      date TEXT NOT NULL,
      odometer REAL NOT NULL,
      liters REAL NOT NULL,
      pricePerLiter REAL NOT NULL,
      totalCost REAL NOT NULL,
      isFullTank INTEGER NOT NULL,
      FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
    );`
  );

  await run(
    _db,
    `CREATE TABLE IF NOT EXISTS service_entries (
      id TEXT PRIMARY KEY,
      carId TEXT NOT NULL,
      date TEXT NOT NULL,
      odometer REAL NOT NULL,
      type TEXT NOT NULL,
      cost REAL NOT NULL,
      notes TEXT,
      FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
    );`
  );

  // экспорт вспомогательных раннеров (чтобы можно было использовать в репозиториях при желании)
  // но если не хочешь — можешь и дальше юзать getAllAsync/runAsync
  (getDb as any).getAll = (sql: string, params?: any[]) => getAll(_db!, sql, params);
  (getDb as any).getFirst = (sql: string, params?: any[]) => getFirst(_db!, sql, params);
  (getDb as any).run = (sql: string, params?: any[]) => run(_db!, sql, params);

  return _db;
}
