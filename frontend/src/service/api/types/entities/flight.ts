import type { City } from '@/service/api/types/entities/city.ts';
import type { Company } from '@/service/api/types/entities/company.ts';

export enum FlightStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELED',
  Delayed = 'DELAYED',
  Completed = 'COMPLETED',
}

export interface Flight {
  id: number;
  route_code: string;
  company: Company;
  departure_city: City;
  arrival_city: City;
  departure_date: string;
  arrival_date: string;
  price: number;
  seats_available: number;
  status: FlightStatus;
  cheapest?: boolean;
}
