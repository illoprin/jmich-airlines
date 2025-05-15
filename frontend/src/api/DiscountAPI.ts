import { mockDiscount } from "@/api/mocks/discount";
import type { Discount } from "@/api/types/entities/discount";
import { NotFoundError, UserTokenError } from "@/lib/service/errors";

export class DiscountAPI {
  public static async validate(token: string, code: string) {
    if (!token) {
      throw new UserTokenError("user is unauthorized");
    }
    const discount = mockDiscount.find(d => d.code === code)
    if (!discount) {
      throw new NotFoundError('invalid discount');
    }
    return discount
  }

  public static async add(token: string, discount: Discount) {
    // Created
  }
}