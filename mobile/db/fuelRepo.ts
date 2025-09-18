// mobile/db/fuelRepo.ts
import { getDb } from './sqlite';
import type { FuelEntry } from '../models/fuelEntry';

export async function listByCar(carId: string): Promise<FuelEntry[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM fuel_entries WHERE carId = ? ORDER BY date DESC, odometer DESC`,
    [carId]
  );
  return rows.map((r) => ({
    id: String(r.id),
    carId: String(r.carId),
    date: String(r.date),
    odometer: Number(r.odometer),
    liters: Number(r.liters),
    pricePerLiter: Number(r.pricePerLiter),
    totalCost: Number(r.totalCost),
    isFullTank: Number(r.isFullTank) === 1,
  }));
}

export async function insert(entry: FuelEntry): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO fuel_entries (id, carId, date, odometer, liters, pricePerLiter, totalCost, isFullTank)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      entry.id,
      entry.carId,
      entry.date,
      entry.odometer,
      entry.liters,
      entry.pricePerLiter,
      entry.totalCost,
      entry.isFullTank ? 1 : 0,
    ]
  );
}

export async function update(entry: FuelEntry): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE fuel_entries
     SET date=?, odometer=?, liters=?, pricePerLiter=?, totalCost=?, isFullTank=?
     WHERE id=?`,
    [
      entry.date,
      entry.odometer,
      entry.liters,
      entry.pricePerLiter,
      entry.totalCost,
      entry.isFullTank ? 1 : 0,
      entry.id,
    ]
  );
}

export async function remove(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM fuel_entries WHERE id=?`, [id]);
}
