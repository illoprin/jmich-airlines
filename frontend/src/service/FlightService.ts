import { FlightAPI } from "@/api/FlightAPI";
import type { Flight } from "@/api/types/entities/flight";
import { handleHttpError } from "@/lib/service/handleHTTPError";

export class FlightService {
  public static async getByID(id: number): Promise<Flight> {
    try {
      const flight = await FlightAPI.getByID(id);
      return flight;
    } catch (err) {
      throw handleHttpError(err);
    }
  }
}