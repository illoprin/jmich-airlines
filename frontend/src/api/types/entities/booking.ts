import type { Flight } from "./flight";

export enum BookingStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Active = 'ACTIVE',
}

export interface Booking {
  id: number;
  created: string;
  user_id: number;
  qr_code: string;
  seats: number;
  baggage_weight: number;
  cost: number;
  flight: Flight;
  status: BookingStatus;
}

export interface TrendingFlight {
  popularity: number;
  flight_id: number;
  departure_city_name: string;
  departure_city_image: string;
  departure_airport_code: string;
  departure_date: string;
  arrival_city_name: string;
  arrival_city_image: string;
  arrival_airport_code: string;
  arrival_date: string;
  price: number;
}
