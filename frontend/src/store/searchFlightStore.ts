import { FlightAPI } from '@/api/FlightAPI';
import type { Flight } from '@/api/types/entities/flight';
import type { FlightSearchPayload } from '@/api/types/requests/flight';
import { handleHttpError } from '@/lib/service/handleHTTPError';
import { defineStore } from 'pinia';
import { HighlightSpanKind } from 'typescript';

export const useSearchFlightStore = defineStore('search-flight', {
  state: () => ({
    flights: [] as Flight[],
    page: 0 as number,
    limit: 5 as number,
    query: {} as FlightSearchPayload,
    searched: false as boolean,
  }),

  actions: {
    setQuery(query: FlightSearchPayload) {
      this.searched = false;
      this.query = query
    },

    async searchFlights() {
      this.page = 0;
      await this.fetchFlights();
      this.searched = true;
    },

    async fetchFlights() {
      try {
        this.flights = await FlightAPI.searchFlights(
          this.query,
          this.limit,
          this.page,
        );
      } catch (err) {
        throw await handleHttpError(err);
      }
    },
  },
});
