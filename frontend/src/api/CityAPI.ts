import type { City } from "@/api/types/entities/city.ts";
import { $host } from './httpClient'

export class CityAPI {
  public static async getAll(): Promise<City[]> {
    const response = await $host.get("city");
    const { cities } = (await response.json() as any);
    return cities;
  }

  public static async getByID(id: number): Promise<City> {
    const response = await $host.get(`city/${id}`);
    const { city } = (await response.json() as any);
    return city;
  }
}