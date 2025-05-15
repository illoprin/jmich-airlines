import { LikedFlightAPI } from "@/api/LikedFlightAPI";
import type { Flight } from "@/api/types/entities/flight";
import { UserTokenError } from "@/lib/service/errors";
import { useUserStore } from "@/store/userStore";
import { defineStore } from "pinia";

export const useLikedStore = defineStore('liked', {
  state: () => ({
    liked: [] as Flight[],
    isGuest: true,
  }),

  actions: {
    isFlightLiked(flightID: number): boolean {
      return this.liked.find(flight => flight.id === flightID) !== undefined;
    },

    async syncAllLikesToServer() {
      if (this.liked.length === 0) return;
      for (const flight of this.liked) {
        try {
          this.syncLikeToServer(flight.id);
        } catch {
          break;
        }
      }
    },

    async syncLikeToServer(flightID: number) {
      const { token } = useUserStore();
      if (!token) {
        throw new UserTokenError('user is unauthorized');
      }
      await LikedFlightAPI.like(flightID, token);
    },
  
    syncDislikeToServer(flightID: number) {
      const { token } = useUserStore();
      if (!token) {
        throw new UserTokenError('user is unauthorized');
      }
      LikedFlightAPI.dislike(flightID, token);
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
        throw new UserTokenError('user is unauthorized');
      }
      this.liked = await LikedFlightAPI.getLikes(token);
    },
  },
});

