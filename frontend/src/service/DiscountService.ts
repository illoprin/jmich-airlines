import { DiscountAPI } from "@/api/DiscountAPI";
import type { Discount } from "@/api/types/entities/discount";

export class DiscountService {
  public static async validateCode(code: string): Promise<Discount> {
    return await DiscountAPI.validate(code);
  }
}