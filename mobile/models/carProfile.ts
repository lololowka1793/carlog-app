// mobile/models/carProfile.ts
export interface CarProfile {
  id: string;  // новый идентификатор
  transport: 'car' | 'motorcycle' | 'bus' | 'truck';
  brand: string;
  model: string;
  plate: string;
  year?: number;
  tanks: number[];   // [70] или [70, 30]
  fuel: 'gasoline' | 'diesel' | 'lpg' | 'electric';
  unit: 'km' | 'mi';
  vin?: string;
  odometer: number;
}
