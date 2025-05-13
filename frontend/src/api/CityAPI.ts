import type { City } from "@/api/types/entities/city.ts";
import { mockCities } from "@/api/mocks/city.ts";

export class CityAPI {
  public static async getAll(): Promise<City[]> {
    return mockCities;
  }
}