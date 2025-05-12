import { mockFlights } from '@/api/mocks/flight';
import type { Flight } from '@/api/types/entities/flight';
import type { FlightSearchPayload } from '@/api/types/requests/flight';

export class FlightAPI {
  public static async searchFlights(
    payload: FlightSearchPayload,
  ): Promise<Flight[]> {
    return mockFlights;
  }
}
