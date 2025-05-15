import { FlightAPI } from "@/api/FlightAPI";
import type { Flight } from "@/api/types/entities/flight";

export class FlightService {
  public static async getByID(id: number): Promise<Flight> {
    return await FlightAPI.getByID(id);    
  }
}