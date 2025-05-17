import { BookingAPI } from "@/api/BookingAPI";
import type { Booking } from "@/api/types/entities/booking";
import { useUserStore } from "@/store/userStore";
import { defineStore } from "pinia";

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: null as null | Booking[],
    count: null as null | number,
  }),

  actions: {
    async getCount(): Promise<number> {
      const { token } = useUserStore();
      this.count = await BookingAPI.getCountForUser(token);
      return this.count;
    },

    async fetchUserBookings(): Promise<Booking[]> {
      const { token } = useUserStore();
      this.bookings = await BookingAPI.getForUser(token);
      return this.bookings;
    }
  }
});