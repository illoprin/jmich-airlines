<script setup lang="ts">

import type { TrendingFlight } from "@/api/types/entities/booking";
import SearchBar from "@/components/views/search/SearchBar.vue";
import SearchedFlights from "@/components/views/search/SearchedFlights.vue";
import TrendingFlights from "@/components/views/search/TrendingFlights.vue";
import { useFetching } from "@/composable/useFetching";
import { BookingService } from "@/service/BookingService";
import { onMounted, ref } from "vue";

function searchSubmit(data: any): void {
  console.log(data);
}

const trendingFlights = ref<TrendingFlight[] | undefined>(undefined);

const { fetchData: fetchTrending, isLoading: isLoadingTrending } = useFetching(async () => {
  trendingFlights.value = await BookingService.getTrendingFlights();
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
    <TrendingFlights :hotTours="trendingFlights" v-if="!isLoadingTrending" />

    <!-- Flights -->
    <SearchedFlights />
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
