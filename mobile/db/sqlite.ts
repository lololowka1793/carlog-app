// mobile/db/sqlite.ts
import * as SQLite from 'expo-sqlite';

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync('carlog.db');
  await _db.execAsync('PRAGMA foreign_keys = ON;');

  // Мини-таблица машин (минимум для внешнего ключа).
  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      unit TEXT NOT NULL,       -- 'km' | 'mi'
      odometer REAL NOT NULL
    );
  `);

  // Таблица заправок
  await _db.execAsync(`
    CREATE TABLE IF NOT EXISTS fuel_entries (
      id TEXT PRIMARY KEY,
      carId TEXT NOT NULL,
      date TEXT NOT NULL,             -- ISO 'YYYY-MM-DD'
      odometer REAL NOT NULL,
      liters REAL NOT NULL,
      pricePerLiter REAL NOT NULL,
      totalCost REAL NOT NULL,
      isFullTank INTEGER NOT NULL,    -- 0/1
      FOREIGN KEY (carId) REFERENCES cars(id) ON DELETE CASCADE
    );
  `);

  return _db;
}
