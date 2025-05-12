import { Entry } from "../../lib/repository/base.repository";

export enum FlightStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DELAYED = "DELAYED",
  CANCELLED = "CANCELLED",
}

export interface FlightEntry extends Entry {
  route_code: string;
  departure_airport_id: number;
  arrival_airport_id: number;
  departure_date: Date;
  arrival_date: Date;
  company_id: number;
  seats_available?: number;
  price: number;
  status?: FlightStatus;
}
