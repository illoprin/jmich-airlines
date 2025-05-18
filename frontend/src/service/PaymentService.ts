import { UserAPI } from "@/api/UserAPI";
import { useUserStore } from "@/store/userStore";

// FIX
export class PaymentService {
  public static async getPayments() {
    const { token } = useUserStore();
    return await UserAPI.getPayments(token);
  }

  public static async remove(id: number) {
    const { token } = useUserStore();
    return await UserAPI.removePayment(token, id);
  }
}