import { $authHost } from "@/api/httpClient";
import { likedFlightMock } from "@/api/mocks/liked";
import type { Flight } from "@/api/types/entities/flight";

export class LikedFlightAPI {
  public static async like(flight_id: number): Promise<void> {
    await $authHost.post(`user/liked/${flight_id}`);
  }

  public static async dislike(flight_id: number): Promise<void> {
    await $authHost.delete(`user/liked/${flight_id}`);
  }

  public static async getLikes(): Promise<Flight[]> {
    const response = await $authHost.get('user/liked');
    const { flights } = (await response.json() as any);
    return flights;
  }
}