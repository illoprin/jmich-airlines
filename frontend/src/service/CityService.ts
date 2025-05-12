import { CityAPI } from "@/api/CityAPI"
import type { City } from "@/api/types/entities/city";

export class CityService {
  public static async getCities(): Promise<City[]> {
    return await CityAPI.getCities();
  }
}