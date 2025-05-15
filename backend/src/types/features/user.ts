import { UserLevel } from "../repository/user";

export interface UserDiscountRule {
  discount: number;
  trendingFlightBonus: number;
}

export const UserLevelDiscountRule: Record<UserLevel, UserDiscountRule> = {
  [UserLevel.Basic]: {
    discount: 0.01,
    trendingFlightBonus: 0,
  },
  [UserLevel.Silver]: {
    discount: 0.08,
    trendingFlightBonus: 0.1,
  },
  [UserLevel.Gold]: {
    discount: 0.1,
    trendingFlightBonus: 0.13,
  },
  [UserLevel.Premium]: {
    discount: 0.15,
    trendingFlightBonus: 0.18,
  },
  [UserLevel.Platinum]: {
    discount: 0.21,
    trendingFlightBonus: 0.25,
  },
};
