import type { Company } from "@/api/types/entities/company.ts";
import type { City } from "@/api/types/entities/city.ts";


export enum FlightStatus {
  Active = 'ACTIVE',
  Canceled = 'CANCELLED',
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
