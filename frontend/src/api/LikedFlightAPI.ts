import { likedFlightMock } from "@/api/mocks/liked";
import type { Flight } from "@/api/types/entities/flight";

export class LikedFlightAPI {
  public static async like(flightID: number, token: string): Promise<void> {

  }

  public static async dislike(flightID: number, token: string): Promise<void> {

  }

  public static async getLikes(token: string): Promise<Flight[]> {
    return likedFlightMock;
  }
}