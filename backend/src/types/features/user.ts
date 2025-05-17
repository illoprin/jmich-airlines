import { UserLevel } from "@/types/repository/user";

export interface UserDiscountRule {
  discount: number;
  trendingFlightBonus: number;
  requiredFlights: number;
}

export const UserLevelDiscountRules: Record<UserLevel, UserDiscountRule> = {
  [UserLevel.Basic]: {
    discount: 0.01,
    trendingFlightBonus: 0,
    requiredFlights: 0,
  },
  [UserLevel.Silver]: {
    discount: 0.08,
    trendingFlightBonus: 0.1,
    requiredFlights: 12,
  },
  [UserLevel.Gold]: {
    discount: 0.1,
    trendingFlightBonus: 0.13,
    requiredFlights: 23,
  },
  [UserLevel.Premium]: {
    discount: 0.15,
    trendingFlightBonus: 0.18,
    requiredFlights: 45,
  },
  [UserLevel.Platinum]: {
    discount: 0.21,
    trendingFlightBonus: 0.25,
    requiredFlights: 102,
  },
};
