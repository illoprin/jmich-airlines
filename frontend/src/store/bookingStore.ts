import { BookingAPI } from "@/api/BookingAPI";
import { BookingStatus, type Booking, type TrendingFlight } from "@/api/types/entities/booking";
import type { CreateBookingPayload } from "@/api/types/requests/booking";
import { handleHttpError } from "@/lib/service/handleHTTPError";
import { defineStore } from "pinia";

export const useBookingStore = defineStore('booking', {
  state: () => ({
    trending: null as null | TrendingFlight[],
    bookings: null as null | Booking[],
    count: 0 as number,
  }),

  actions: {
    async getCount(): Promise<number> {
      try {
        this.count = await BookingAPI.getCountForUser(BookingStatus.Active);
        return this.count;
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async fetchUserBookings(): Promise<Booking[]> {
      try {
        this.bookings = await BookingAPI.getForUser();
        return this.bookings;
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async add(payload: CreateBookingPayload): Promise<void> {
      try {
        await BookingAPI.add(payload);
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async fetchTrending(): Promise<TrendingFlight[]> {
      if (!this.trending) {
        try {
          this.trending = await BookingAPI.getTrending(10, 1);
          return this.trending;
        } catch (err) {
          throw await handleHttpError(err);
        }
      }
      return this.trending;
    }
  }
});