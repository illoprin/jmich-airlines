<script setup lang="ts">
import { FlightAPI } from "@/api/FlightAPI";
import type { TrendingFlight } from "@/api/types/entities/booking";
import type { Flight } from "@/api/types/entities/flight";
import type { FlightSearchPayload } from "@/api/types/requests/flight";
import SearchBar from "@/components/views/search/SearchBar.vue";
import SearchedFlights from "@/components/views/search/SearchedFlights.vue";
import TrendingFlights from "@/components/views/search/TrendingFlights.vue";
import { useFetching } from "@/composable/useFetching";
import { BookingService } from "@/service/BookingService";
import { useLikedStore } from "@/store/likedFlightsStore";
import { computed, onMounted, ref } from "vue";

async function searchSubmit(data: FlightSearchPayload) {
  searchQuery.value = data;
  await searchFlights();
}

const trendingFlights = ref<TrendingFlight[] | undefined>(undefined);
const searchedFlights = ref<Flight[]>([]);
const searchQuery = ref<FlightSearchPayload>({});
const likes = useLikedStore();

const {
  fetchData: fetchTrending,
  isLoading: isLoadingTrending
} = useFetching(async () => {
  trendingFlights.value = await BookingService.getTrendingFlights();
});

const {
  fetchData: searchFlights,
  isLoading: isLoadingFlights,
} = useFetching(async () => {
  searchedFlights.value = await FlightAPI.searchFlights(
    searchQuery.value
  );
});

onMounted(() => {
  fetchTrending();
});

</script>

<template>
  <div class="container">
    <!-- Title -->
    <h1 class="text-center fw-bold">ЛЕТАЕМ С ОДНИМ КРЫЛОМ</h1>

    <!-- Search Bar -->
    <SearchBar :on-submit="searchSubmit" />

    <!-- Hot Tours -->
    <TrendingFlights
      :hotTours="trendingFlights"
      v-if="trendingFlights && searchedFlights.length <= 0"
    />

    <!-- Flights -->
    <SearchedFlights
      v-if="searchedFlights.length > 0"
      :flights="searchedFlights"
    />
  </div>
</template>

<style>
@media screen and (max-width: 1080px) {
  .search-panel {
    flex-flow: column nowrap;
  }

  .search-panel>* {
    width: 100% !important;
  }

  .form-glass {
    display: block;
  }
}

.search-panel {
  margin-top: 5rem;
}
</style>
