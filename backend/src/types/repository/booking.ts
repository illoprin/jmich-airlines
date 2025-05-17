import { Entry } from "@/lib/repository/base.repository";

export enum BookingStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface BookingEntry extends Entry {
  flight_id?: number;
  user_id: number;
  baggage_weight: number;
  seats: number;
  created: Date;
  qr_code: string;
  cost: number;
  status?: BookingStatus;
}
