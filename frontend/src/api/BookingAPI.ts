import { mockTrendingFlights, mockUserBookings } from "@/api/mocks/booking";
import type { Booking, TrendingFlight } from "@/api/types/entities/booking";
import type { CreateBookingPayload } from "@/api/types/requests/booking";

export class BookingAPI{
  public static async getTrending(limit: number, page: number): Promise<TrendingFlight[]> {
    page += 1;
    return mockTrendingFlights;
  }

  public static async add(entry: CreateBookingPayload): Promise<void> {

  }

  static async getByID(id: number): Promise<Booking> {
    return mockUserBookings[0];
  }

  static async getForUser(token: string): Promise<Booking[]> {
    return mockUserBookings;
  }

  public static async updateByID(payload: any): Promise<void> {

  }

  public static async removeByID(payload: any): Promise<void> {

  }
}