import type { Flight } from '@/service/api/types/entities/flight.ts';

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
