import type { FlightDTO } from "@/types/dto/flight";
import type { Entry } from "../../lib/repository/base.repository";
import { BookingStatus } from "../repository/booking";

export interface CreateBookingPayload {
  user_id: number;
  flight_id: number;
  payment_id: number;
  baggage_weight: number;
  code?: string;
  seats: number;
}

export interface BookingPriceDetails {
  base_ticket_price: number;
  code_discount: number;
  level_discount: number;
  additional_discount: number;
  total_cost: number;
}

export interface BookingDTO extends Entry {
  created: Date;
  flight: FlightDTO;
  user_id: number;
  seats: number;
  qr_code: string;
  baggage_weight: number;
  cost: number;
  status: BookingStatus;
}
