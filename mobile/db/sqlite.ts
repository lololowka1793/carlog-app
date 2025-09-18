// mobile/db/sqlite.ts
import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('carlog.db');
  await _db.execAsync('PRAGMA foreign_keys = ON;');

  // --- Таблица машин: добавили все поля + флаг isActive ---
  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      transport TEXT NOT NULL,                   -- 'car' | 'motorcycle' | ...
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      plate TEXT NOT NULL,
      year INTEGER,
      unit TEXT NOT NULL,                        -- 'km' | 'mi'
      vin TEXT,
      odometer REAL NOT NULL,
      fuel TEXT NOT NULL,                        -- 'gasoline' | 'diesel' | ...
      tanks TEXT NOT NULL,                       -- JSON: "[70]" или "[70,30]"
      isActive INTEGER NOT NULL DEFAULT 0        -- 0/1
    );
  `);

  // --- Таблица заправок (как сделали ранее) ---
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

  // На будущее: таблица ТО (если ещё не добавлял)
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
