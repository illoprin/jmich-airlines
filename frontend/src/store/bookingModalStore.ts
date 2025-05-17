import type { Booking } from "@/api/types/entities/booking";
import { defineStore } from "pinia";

export const useBookingModalStore = defineStore('booking-modal', {
  state: () => ({
    visible: false as boolean,
    booking: null as Booking | null,
  })
});