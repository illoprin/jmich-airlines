import { LikedFlightAPI } from "@/api/LikedFlightAPI";
import type { Flight } from "@/api/types/entities/flight";
import { handleHttpError } from "@/lib/service/handleHTTPError";
import { useUserStore } from "@/store/userStore";
import { defineStore } from "pinia";

export const useLikedStore = defineStore('liked', {
  state: () => ({
    liked: [] as Flight[],
  }),

  persist: {
    pick: ['liked', 'isGuest'],
  },

  actions: {
    isFlightLiked(flightID: number): boolean {
      return this.liked.find(flight => flight.id === flightID) !== undefined;
    },

    async syncLikeToServer(flightID: number) {
      try {
        await LikedFlightAPI.like(flightID);
      } catch (err) {
        throw await handleHttpError(err);
      }
    },
  
    async syncDislikeToServer(flightID: number) {
      try {
        await LikedFlightAPI.dislike(flightID);
      } catch (err) {
        throw await handleHttpError(err);
      }
    },
  
    async like(flight: Flight) {
      const user = useUserStore();
      if (!user.token) {
        if (!this.liked.find(f => f.id === flight.id)) {
          this.liked.push(flight);
        }
      } else {
        await this.syncLikeToServer(flight.id);
      }
    },
    
    async dislike(flight: Flight) {
      const user = useUserStore();
      if (!user.token) {
        this.liked =
          [...this.liked].filter(f => f.id !== flight.id);
      } else {
        await this.syncDislikeToServer(flight.id);
      }
    },

    async fetchLikes() {

      const user = useUserStore();
      if (!user.token) {
        return
      }

      try {
        this.liked = await LikedFlightAPI.getLikes();
      } catch (err) {
        throw await handleHttpError(err);
      }
    },
  },
});

