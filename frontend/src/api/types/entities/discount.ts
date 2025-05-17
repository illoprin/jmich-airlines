import type { UserLevel } from "@/api/types/entities/user";


export interface UserDiscountRule {
  discount: number;
  trendingFlightBonus: number;
  requiredFlights: number;
}

export type UserLevelDiscountRules = Record<UserLevel, UserDiscountRule>;

export interface Discount {
  id?: number
  code: string;
  amount: number;
  valid_until: string;
}