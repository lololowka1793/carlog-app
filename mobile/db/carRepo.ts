// mobile/db/carRepo.ts
import { getDb } from './sqlite';
import type { CarProfile } from '../models/carProfile';

function rowToCar(row: any): CarProfile {
  return {
    id: String(row.id),
    transport: String(row.transport) as any,
    brand: String(row.brand),
    model: String(row.model),
    plate: String(row.plate),
    year: row.year == null ? undefined : Number(row.year),
    unit: String(row.unit) as any,
    vin: row.vin == null ? undefined : String(row.vin),
    odometer: Number(row.odometer),
    fuel: String(row.fuel) as any,
    tanks: JSON.parse(row.tanks ?? '[]'),
  };
}

export async function list(): Promise<CarProfile[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM cars ORDER BY isActive DESC, brand ASC, model ASC`
  );
  return rows.map(rowToCar);
}

export async function getActiveId(): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<any>(`SELECT id FROM cars WHERE isActive=1 LIMIT 1`);
  return row?.id ? String(row.id) : null;
}

export async function insert(car: CarProfile): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO cars (id, transport, brand, model, plate, year, unit, vin, odometer, fuel, tanks, isActive)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [
      car.id, car.transport, car.brand, car.model, car.plate,
      car.year ?? null, car.unit, car.vin ?? null, car.odometer,
      car.fuel, JSON.stringify(car.tanks),
    ]
  );
}

export async function update(car: CarProfile): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE cars SET
      transport=?, brand=?, model=?, plate=?, year=?, unit=?, vin=?, odometer=?, fuel=?, tanks=?
     WHERE id=?`,
    [
      car.transport, car.brand, car.model, car.plate,
      car.year ?? null, car.unit, car.vin ?? null, car.odometer,
      car.fuel, JSON.stringify(car.tanks), car.id,
    ]
  );
}

export async function remove(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM cars WHERE id=?`, [id]);
}

export async function setActive(id: string): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    await db.runAsync(`UPDATE cars SET isActive=0 WHERE isActive=1`);
    await db.runAsync(`UPDATE cars SET isActive=1 WHERE id=?`, [id]);
  });
}
