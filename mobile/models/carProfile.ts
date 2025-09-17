// mobile/models/carProfile.ts
export interface CarProfile {
  id: string;  // уникальный идентификатор
  transport: 'car' | 'motorcycle' | 'bus' | 'truck';
  brand: string;
  model: string;
  plate: string;
  year?: number;
  tanks: number[]; // один или два бака
  fuel: 'gasoline' | 'diesel' | 'lpg' | 'electric';
  unit: 'km' | 'mi';
  vin?: string;
  odometer: number;
}
