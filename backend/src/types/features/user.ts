import { UserLevel } from "../repository/user";

export interface UserDiscountRule {
  discount: number;
  trendingFlightBonus: number;
  randomFlightBonus?: () => boolean;
}

export const UserLevelDiscountRule: Record<UserLevel, UserDiscountRule> = {
  [UserLevel.Basic]: {
    discount: 0.04,
    trendingFlightBonus: 0,
    randomFlightBonus: () => Math.random() < 0.04, // Шанс что перепадёт скидка в 4%
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
    randomFlightBonus: () => Math.random() < 0.2, // Шанс 20% что сервис вернёт деньги за билет
  },
};
