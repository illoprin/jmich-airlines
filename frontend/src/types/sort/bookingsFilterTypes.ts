import { BookingStatus } from "@/api/types/entities/booking";

export enum BookingsFilterTypes {
  All = "all",
  Completed = BookingStatus.Completed,
  Cancelled = BookingStatus.Cancelled,
  Active = BookingStatus.Active
}