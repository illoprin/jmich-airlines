import { LikedFlightAPI } from "@/api/LikedFlightAPI";
import type { Flight } from "@/api/types/entities/flight";
import { handleHttpError } from "@/lib/service/handleHTTPError";
import { useUserStore } from "@/store/userStore";
import { defineStore } from "pinia";

export const useLikedStore = defineStore('liked', {
  state: () => ({
    liked: [] as Flight[],
    isGuest: true,
  }),

  persist: {
    pick: ['liked'],
  },

  actions: {
    isFlightLiked(flightID: number): boolean {
      return this.liked.find(flight => flight.id === flightID) !== undefined;
    },

    async syncAllLikesToServer() {
      if (this.liked.length === 0) return;
      const flightsToStore = [...this.liked];
      this.liked = [];
      try {
        for (const flight of this.liked) {
          this.syncLikeToServer(flight.id);
        }
        this.isGuest = false;
      } catch (err) {
        throw await handleHttpError(err);
      }
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
      if (this.isGuest) {
        if (!this.liked.find(f => f.id === flight.id)) {
          this.liked.push(flight);
        }
      }
      if (!this.isGuest) this.syncLikeToServer(flight.id);
    },
    
    async dislike(flight: Flight) {
      if (this.isGuest) {
        this.liked =
          [...this.liked].filter(f => f.id !== flight.id);
      }
      if (!this.isGuest) this.syncDislikeToServer(flight.id);
    },

    async fetchLikes() {
      const { token } = useUserStore();
      if (!token) {
        this.isGuest = true;
        return;
      }
      try {
        this.liked = await LikedFlightAPI.getLikes();
      } catch (err) {
        throw await handleHttpError(err);
      }
    },
  },
});

