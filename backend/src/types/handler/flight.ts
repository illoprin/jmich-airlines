import type { Entry } from "../../lib/repository/base.repository";

export interface FlightSearchPayload {
  departure_airport_id?: number;
  arrival_airport_id?: number;
  departure_date?: Date;
  seats?: number;
  max: number;
  page: number;
}
