import { mockTrendingFlights } from "@/api/mocks/booking";
import type { TrendingFlight } from "@/api/types/entities/booking";

export class BookingAPI {
  public static async getTrending(limit: number, page: number): Promise<TrendingFlight[]> {
    page += 1;
    return mockTrendingFlights;
  }
}