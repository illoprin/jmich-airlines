import { BookingAPI } from "@/api/BookingAPI";
import type { TrendingFlight } from "@/api/types/entities/booking";

export class BookingService {
  public static async getTrendingFlights(): Promise<TrendingFlight[]> {
    return await BookingAPI.getTrending(10, 1);
  }
}