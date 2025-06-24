import { BookingAPI } from "@/api/BookingAPI";
import { BookingStatus, type Booking } from "@/api/types/entities/booking";
import { BookingRefundTypes } from "@/types/sort/bookingRefundTypes";
import type { HTTPError } from "ky";
import { defineStore } from "pinia";

export const useBookingRefundStore = defineStore('booking-refund-modal', {
  state: () => ({
    type: null as BookingRefundTypes | null,
    visible: false as boolean,
    booking: null as Booking | null,
  }),
  actions: {
    async cancel() {
      if (this.booking) {
        try {
          await BookingAPI.updateStatus(this.booking.id, BookingStatus.Cancelled)
        } catch (err) {
          alert(((await (err as HTTPError).response.json()) as any).message)
        }
      }
    },
    async refund() {
      if (this.booking) {
        console.log("make refund")
      }
    }
  }
});