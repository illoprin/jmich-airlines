import { mockTrendingFlights, mockUserBookings } from "@/api/mocks/booking";
import type { Booking, TrendingFlight } from "@/api/types/entities/booking";
import type { CreateBookingPayload } from "@/api/types/requests/booking";
import { NotFoundError, UserTokenError } from "@/lib/service/errors";

export class BookingAPI{
  public static async getTrending(limit: number, page: number): Promise<TrendingFlight[]> {
    page += 1;
    return mockTrendingFlights;
  }

  public static async add(token: string, entry: CreateBookingPayload): Promise<void> {
    if (!token) {
      throw new UserTokenError('user is unauthorized');
    }
    
  }

  static async getByID(token: string, id: number): Promise<Booking> {
    if (!token) {
      throw new UserTokenError('user is unauthorized');
    }
    const booking = mockUserBookings.find(b => b.id === id);
    if (!booking) {
      throw new NotFoundError('invalid id');
    }

    return booking;
  }

  static async getForUser(token: string): Promise<Booking[]> {
    if (!token) {
      throw new UserTokenError('user is unauthorized');
    }
    return mockUserBookings;
  }

  static async getClosestForUser(token: string): Promise<Booking> {
    if (!token) {
      throw new UserTokenError('user is unauthorized');
    }
    return mockUserBookings[0];
  }

  public static async updateByID(token: string, payload: any): Promise<void> {
    if (!token) {
      throw new UserTokenError('user is unauthorized');
    }

  }

  public static async removeByID(token: string, id: number): Promise<void> {
    if (!token) {
      throw new UserTokenError('user is unauthorized');
    }

  }

  public static async getCountForUser(token: string): Promise<number> {
    if (!token) {
      throw new UserTokenError('user is unauthorized');
    }
    return mockUserBookings.length;
  }  
}