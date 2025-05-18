import { CityAPI } from "@/api/CityAPI";
import type { City } from "@/api/types/entities/city";
import { handleHttpError } from "@/lib/service/handleHTTPError";
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
        throw await handleHttpError(err);
      }
    },

    async getByID(id: number): Promise<City> {
      try {
        const city = await CityAPI.getByID(id);
        return city;
      } catch (err) {
        throw await handleHttpError(err);
      }
    }
  },
})