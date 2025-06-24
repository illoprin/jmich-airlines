import type { UserLevelDiscountRules } from "@/api/types/entities/discount";
import { UserLevel, type User } from "@/api/types/entities/user";
import type { UserLoginPayload, UserRegistrationPayload } from "@/api/types/requests/user";
import { UserAPI } from "@/api/UserAPI";
import { handleHttpError } from "@/lib/service/handleHTTPError";
import { useLikedStore } from "@/store/likedFlightsStore";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    user: null as null | User,
    rules: null as UserLevelDiscountRules | null,
    __needsFetching: false as boolean,
  }),
  persist: {
    pick: ['token']
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUserDiscount: (state) => {
      if (state.rules && state.user) {
        return state.rules[state.user.level].discount;
      } else {
        return null;
      }
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token;
    },

    logout() {
      useLikedStore().liked = [];
      this.token = '';
      this.user = null;
    },

    async login(payload: UserLoginPayload) {
      try {
        // Login
        const token = await UserAPI.loginUser(payload);
        this.setToken(token);
        this.user = await UserAPI.getCurrentUser();
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async register(payload: UserRegistrationPayload) {
      try {
        await UserAPI.registerUser(payload);
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async verify(): Promise<boolean> {
      try {
        this.token = await UserAPI.verifyUser();
        return true;
      } catch {
        this.logout();
        return false;
      }
    },

    async fetchUser(): Promise<User> {
      try {
        this.user = await UserAPI.getCurrentUser();
        return this.user;
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async update(payload: any) {
      try {
        await UserAPI.updateCurrentUser(payload);
        this.__needsFetching = true;
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async remove() {
      try {
        await UserAPI.removeUser();
        this.logout();
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    async fetchRules() {
      try {
        if (!this.rules)
          this.rules = await UserAPI.getRules();
      } catch (err) {
        throw await handleHttpError(err);
      }
    },

    getNextRule() {
      if (this.rules && this.user) {
        return Object.values(this.rules as UserLevelDiscountRules)[
          Object.values(UserLevel).findIndex(e => e === this.user?.level) + 1
        ] ?? null;
      }
      return null;
    }
  },
});