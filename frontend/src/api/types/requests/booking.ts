import type { Payment } from "@/api/types/entities/payment";

export interface CreateBookingPayload {
  flight_id: number;
  payment_id?: number;
  payment?: Payment;
  baggage_weight: number;
  seats: number;
  code?: string;
}

export interface UpdateBookingPayload {
  status: string;
}
