import { $authHost, $host } from '@/api/httpClient';
import {
  BookingStatus,
  type Booking,
  type TrendingFlight,
} from '@/api/types/entities/booking';
import type { CreateBookingPayload } from '@/api/types/requests/booking';

export class BookingAPI {
  public static async getTrending(
    limit: number,
    page: number,
  ): Promise<TrendingFlight[]> {
    const response = await $host.get(`booking/trending`, {
      searchParams: {
        limit, page
      }
    });
    const { trending } = (await response.json()) as any;
    return trending;
  }

  public static async add(
    payload: CreateBookingPayload,
  ): Promise<void> {
    await $authHost.post('booking', {
      json: payload,
    });
  }

  static async getByID(id: number): Promise<Booking> {
    const response = await $authHost.get(`booking/${id}`);
    const { booking } = (await response.json()) as any;
    return booking;
  }

  static async getForUser(): Promise<Booking[]> {
    const response = await $authHost.get(`booking`);
    const { bookings } = (await response.json()) as any;
    return bookings;
  }

  static async getClosestForUser(): Promise<Booking> {
    const response = await $authHost.get(`booking/closest`);
    const { booking } = (await response.json()) as any;
    return booking;
  }

  public static async removeByID(id: number): Promise<void> {
    await $authHost.delete(`booking/${id}`);
  }

  public static async updateStatus(id: number, status: BookingStatus): Promise<void> {
    await $authHost.put(`booking/${id}/status`, {
      json: {
        status
      }
    })
  }

  public static async getCountForUser(
    status: BookingStatus,
  ): Promise<number> {
    const response = await $authHost.get(`booking/count/${status}`)
    const { count } = (await response.json()) as any;
    return count;
  }
}
