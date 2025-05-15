import type { Discount } from "@/api/types/entities/discount";

export const mockDiscount: Discount[] = [
  {
    code: "shaltay2101",
    valid_until: new Date(Date.now() + 10 * 60 * 1000 * 60 * 24 * 3)
      .toISOString(),
    amount: 0.13,
  },
  {
    code: "yarn2306",
    valid_until: new Date(Date.now() + 10 * 60 * 1000 * 60 * 24 * 3)
      .toISOString(),
    amount: 0.03,
  },
]