import { $authHost } from "@/api/httpClient";
import type { Discount } from "@/api/types/entities/discount";

export class DiscountAPI {
  public static async validate(code: string): Promise<Discount> {
    const response = await $authHost.post(`booking/discount/validate/${code}`);
    const { discount } = (await response.json() as any);
    return discount;
  }

  public static async add(discount: Discount) {
    await $authHost.post('booking/discount', {
      json: discount
    });
  }

  public static async remove(code: string) {
    await $authHost.delete(`booking/discount/${code}`);
  }


}