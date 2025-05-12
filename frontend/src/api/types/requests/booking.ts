export interface CreateBookingPayload {
  flight_id: number;
  payment_id: number;
  code?: string;
  baggage_weight: number;
  seats: number;
}

export interface UpdateBookingPayload {
  status: string;
}
