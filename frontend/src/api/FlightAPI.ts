import { mockFlights } from '@/api/mocks/flight';
import type { Flight } from '@/api/types/entities/flight';
import type { FlightSearchPayload } from '@/api/types/requests/flight';
import { NotFoundError } from '@/lib/service/errors';

export class FlightAPI {
  public static async searchFlights(
    payload: FlightSearchPayload,
  ): Promise<Flight[]> {
    return mockFlights;
  }

  public static async getByID(
    id: number,
  ): Promise<Flight> {
    const flight = mockFlights.find(flight => flight.id === id);
    if (!flight) {
      throw new NotFoundError("invalid flight");
    }
    return flight;
  }

  
  


}
