// mobile/models/fuelEntry.ts
export interface FuelEntry {
  id: string;
  carId: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  isFullTank: boolean;
}
