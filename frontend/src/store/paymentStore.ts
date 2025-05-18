import type { Payment } from "@/api/types/entities/payment";
import { UserAPI } from "@/api/UserAPI";
import { handleHttpError } from "@/lib/service/handleHTTPError";
import { defineStore } from "pinia";

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: [] as Payment[],
  }),

  actions: {
    async fetchPayment() {
      try {
        this.payments = await UserAPI.getPayments();
      } catch (err) {
        throw await handleHttpError(err);
      }
    },
    
    async addPayment(payment: Payment) {
      try {
        await UserAPI.addPayment(payment);
      } catch (err) {
        throw await handleHttpError(err);
      }      
    }
  }
});