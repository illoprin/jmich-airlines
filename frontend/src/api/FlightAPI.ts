import { $host } from '@/api/httpClient';
import { mockFlights } from '@/api/mocks/flight';
import type { Flight } from '@/api/types/entities/flight';
import type { FlightSearchPayload } from '@/api/types/requests/flight';


export class FlightAPI {
  public static async searchFlights(
    payload: FlightSearchPayload,
    limit: number = 10,
    page: number = 0
  ): Promise<Flight[]> {
    const response = await $host.post('flight/search', {
      json: payload,
      searchParams: {
        limit, page
      }
    });
    const { flights } = (await response.json() as any);
    return flights;
  }

  public static async getByID(
    id: number,
  ): Promise<Flight> {
    const response = await $host.get(`flight/${id}`);
    const { flight } = (await response.json() as any);
    return flight;
  }
}
