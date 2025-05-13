import type { User } from "@/api/types/entities/user";
import type { UserLoginPayload, UserRegistrationPayload } from "@/api/types/requests/user";
import { UserAPI } from "@/api/UserAPI";
import { processAPIError } from "@/lib/service/processServerError";
import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '' as string,
    user: null as null | User,
  }),
  persist: {
    pick: ['token', 'user']
  },

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user
  },

  actions: {
    setToken(token: string) {
      this.token = token;
    },

    logout() {
      this.token = '';
      this.user = null;
    },

    async login(payload: UserLoginPayload) {
      try {
        const token = await UserAPI.loginUser(payload);
        this.setToken(token);
        this.user = await UserAPI.getCurrentUser(token);
      } catch (err) {
        throw processAPIError(err);
      }
    },

    async register(payload: UserRegistrationPayload) {
      try {
        await UserAPI.registerUser(payload);
      } catch (err) {
        throw processAPIError(err);
      }
    },

    async verify(): Promise<boolean> {
      try {
        this.token = await UserAPI.verifyUser(this.token);
        return true;
      } catch {
        this.logout();
        return false;
      }
    },

    async fetchUser(): Promise<User> {
      try {
        if (!this.user) {
          this.user = await UserAPI.getCurrentUser(this.token);
        }
        return this.user;
      } catch (err) {
        throw processAPIError(err);
      }
    },

    async update(payload: any) {
      try {
        await UserAPI.updateCurrentUser(this.token, payload);
        // WARN: two requests that we can merge in one
        this.user = await UserAPI.getCurrentUser(this.token);
      } catch (err) {
        throw processAPIError(err);
      }
    },

    async remove() {
      try {
        await UserAPI.removeUser(this.token);
        this.logout();
      } catch (err) {
        throw processAPIError(err);
      }
    },
  },
});