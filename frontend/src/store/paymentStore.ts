import type { Payment } from "@/api/types/entities/payment";
import { UserAPI } from "@/api/UserAPI";
import { useUserStore } from "@/store/userStore";
import { defineStore } from "pinia";

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    payments: null as Payment[] | null,
  }),

  actions: {
    async fetchPayment() {
      const { token } = useUserStore();
      this.payments = await UserAPI.getPayments(token);
    }
  }
});