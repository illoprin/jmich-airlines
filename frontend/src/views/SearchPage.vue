<script setup lang="ts">
import SearchBar from "@/components/views/search/SearchBar.vue";
import SearchedFlights from "@/components/views/search/SearchedFlights.vue";
import TrendingFlights from "@/components/views/search/TrendingFlights.vue";
import { useFetching } from "@/composable/useFetching";
import { useBookingStore } from "@/store/bookingStore";
import { useSearchFlightStore } from "@/store/searchFlightStore";
import { computed, onMounted, ref } from "vue";

const header = ref<string>("ЛЕТАЕМ С ОДНИМ КРЫЛОМ");
const bookingStore = useBookingStore();
const searchStore = useSearchFlightStore();

const {
  fetchData: fetchTrending,
} = useFetching(async () => {
  await bookingStore.fetchTrending();
});

const searchBarStyle = computed<string>(() => {
  if ((!bookingStore.trending || bookingStore.trending.length === 0)
  && searchStore.flights.length === 0) {
    return `margin-bottom: 50dvh`;
  }
  return `margin-bottom: 2rem;`
});

const headerStyle = computed<string>(() => {
  if ((!bookingStore.trending || bookingStore.trending.length === 0)
    && searchStore.flights.length === 0
  ) {
    return `margin-top: 20dvh`;
  }
  return ``
});

onMounted(() => {
  fetchTrending();
});

</script>

<template>
  <div class="container">
    <!-- Title -->
    <h1
      class="text-center fw-bold search-header"
      :style="headerStyle"
    >
      {{ header }}
    </h1>

    <!-- Search Bar -->
    <SearchBar
      :style="searchBarStyle"
    />

    <!-- Hot Tours -->
    <TrendingFlights
      v-if="bookingStore.trending
      && searchStore.flights.length <= 0
      && bookingStore.trending.length > 0"
      :hotTours="bookingStore.trending"
    />

    <!-- Flights -->
    <SearchedFlights
      v-if="searchStore.flights.length > 0"
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
  transition: margin-bottom 300ms;
  will-change: margin-bottom;
}

.search-header {
  transition: margin-top 300ms;
  will-change: margin-top;
}
</style>
