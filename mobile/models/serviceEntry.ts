export interface ServiceEntry {
  id: string;
  date: string;
  type: string;   // "oil change", "filters", etc.
  cost: number;
  notes?: string;
  odometer: number;
}
