import { CityAPI } from "@/api/CityAPI";
import type { City } from "@/api/types/entities/city";
import { processAPIError } from "@/lib/service/processServerError";
import { defineStore } from "pinia";

export const useCities = defineStore('city', {
  state: () => ({
    cities: null as null | City[]
  }),

  actions: {
    async fetchCities(): Promise<City[]> {
      try {
        this.cities = await CityAPI.getAll();
        return this.cities;
      } catch (err) {
        throw processAPIError(err);
      }
    },

    async getByID(id: number): Promise<City> {
      if (!this.cities || !this.cities.length) {
        await this.fetchCities();
      }
      return this.cities?.find(
        (city) => city.id === id
      ) as City;
    }
  },
})