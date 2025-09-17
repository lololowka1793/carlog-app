// mobile/models/serviceEntry.ts
export interface ServiceEntry {
  id: string;
  carId: string;
  date: string;
  odometer: number;
  type: string;
  cost: number;
  notes?: string;
}
