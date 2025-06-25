import { UserAPI } from "@/api/UserAPI";

export class PaymentService {
  public static async getPayments() {
    return await UserAPI.getPayments();
  }

  public static async remove(id: number) {
    return await UserAPI.removePayment(id);
  }
}