import { DiscountAPI } from "@/api/DiscountAPI";
import type { Discount } from "@/api/types/entities/discount";
import { handleHttpError } from "@/lib/service/handleHTTPError";
import { useUserStore } from "@/store/userStore";

export class DiscountService {
  public static async validateCode(code: string): Promise<Discount> {
    const { token } = useUserStore();
    return await DiscountAPI.validate(token, code);
  }
}