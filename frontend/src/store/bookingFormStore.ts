import type { Discount } from "@/api/types/entities/discount";
import { defineStore } from "pinia";

export const useBookingForm = defineStore('booking-form', {
  state: () => ({
    flightId: undefined as number | undefined,
    paymentId: undefined as number | undefined,
    payment: {} as any,
    saveCard: false as boolean,
    baggageWeight: 0 as number,
    seats: 1 as number,
    code: "" as string,
    discount: undefined as Discount | undefined,
  }),

  actions: {
    clear() {
      this.flightId = undefined;
      this.paymentId = undefined;
      this.payment = {};
      this.saveCard = false;
      this.baggageWeight = 0;
      this.seats = 1;
      this.code = "";
      this.discount = undefined;
    }
  }
})