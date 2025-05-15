

export interface UserDiscountRule {
  discount: number;
  trendingFlightBonus: number;
  randomFlightBonus?: () => boolean;
}

export type UserLevelDiscountRule = Record<string, UserDiscountRule>;

export interface Discount {
  id?: number
  code: string;
  amount: number;
  valid_until: string;
}