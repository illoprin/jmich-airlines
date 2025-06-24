<template>

  <div class="d-flex gap-3 flex-wrap align-items-baseline">
    <!-- Sort panel -->
    <div class="glass-convex glass-border glass-padding flex-fill">
      <GlassPanelHeader>
        <template v-slot:header>
          Сортировка
        </template>
      </GlassPanelHeader>
      <div class="">
        <GlassFancyRadioVertical :options="sortOptions" v-model:value="sortBy" />
        <GlassFancyRadioHorizontal :options="orderOptions" v-model:value="order" class="mt-3"/>
      </div>
    </div>
    <!-- Flights -->
    <div class="flights-list glass-convex glass-border glass-padding">

      <!-- Pagination -->
      <div class="d-flex justify-content-between mb-3">
        <h4 class="fw-bold mb-2">
          Мы нашли пару рейсов
        </h4>
        <PaginationController
          v-if="flightStore.flights.length >= flightStore.limit
          && flightStore.searched"
          v-model:page="flightStore.page"
          :callback="flightStore.fetchFlights"
        />
      </div>

      <!-- Searched Flights -->
      <div class="d-flex gap-3 flex-column">
        <SearchedFlightItem
          v-for="flight in sortedFlights"
          :key="flight.id"
          :flight="flight"
        />
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import GlassPanelHeader from '@/components/shared/GlassPanelHeader.vue';
import PaginationController from '@/components/shared/PaginationController.vue';
import GlassFancyRadioHorizontal from '@/components/UI/GlassFancyRadioHorizontal.vue';
import GlassFancyRadioVertical from '@/components/UI/GlassFancyRadioVertical.vue';
import SearchedFlightItem from '@/components/views/search/components/SearchedFlightItem.vue';
import { useLikedStore } from '@/store/likedFlightsStore';
import { useSearchFlightStore } from '@/store/searchFlightStore';
import { FlightSortTypes } from '@/types/sort/flightSortTypes';
import { OrderOptions } from '@/types/sort/order';
import type { DefaultOption } from '@/types/ui/fancyRadio';
import { computed, onMounted, ref } from 'vue';

const likedStore = useLikedStore();
const flightStore = useSearchFlightStore();

onMounted(async () => {
  await likedStore.fetchLikes();
})

const sortBy = ref(FlightSortTypes.Date);
const sortOptions = [
  { label: 'Цена', value: FlightSortTypes.Price },
  { label: 'Дата вылета', value: FlightSortTypes.Date },
  { label: 'Продолжительность полёта', value: FlightSortTypes.Duration },
  { label: 'Стоимость багажа', value: FlightSortTypes.Baggage }
];

const order = ref(OrderOptions.ASC);
const orderOptions = computed<DefaultOption[]>(() => {
  switch (sortBy.value) {
    case FlightSortTypes.Price:
      return [
        { label: "Сначала дешёвые", value: OrderOptions.ASC },
        { label: "Хочу подороже", value: OrderOptions.DESC },
      ];
    case FlightSortTypes.Date:
      return [
        { label: "Раньше", value: OrderOptions.ASC },
        { label: "Позже", value: OrderOptions.DESC },
      ];
    case FlightSortTypes.Baggage:
      return [
        { label: "Сначала ниже", value: OrderOptions.ASC },
        { label: "Сначала выше", value: OrderOptions.DESC },
      ];
    case FlightSortTypes.Duration:
      return [
        { label: "Оптимальные", value: OrderOptions.ASC },
        { label: "Продолжительные", value: OrderOptions.DESC },
      ];
  }
})
const sortedFlights = computed<Flight[]>(() => {
  const flightsCopy = [ ...flightStore.flights ];

  const getDuration = (flight: Flight): number => {
    const dep = new Date(flight.departure_date);
    const arr = new Date(flight.arrival_date);
    return arr.getTime() - dep.getTime();
  };

  const getDepartureTime = (flight: Flight): number => {
    return new Date(flight.departure_date).getTime();
  };

  const getBaggagePrice = (flight: Flight): number => {
    return flight.company.baggage_rule?.price_per_kg ?? Infinity;
  };

  const compare = (a: Flight, b: Flight, getter: (f: Flight) => number) => {
    const aValue = getter(a);
    const bValue = getter(b);
    return order.value === OrderOptions.ASC ? aValue - bValue : bValue - aValue;
  };

  switch (sortBy.value) {
    case FlightSortTypes.Price:
      return flightsCopy.sort((a, b) => compare(a, b, f => f.price));

    case FlightSortTypes.Duration:
      return flightsCopy.sort((a, b) => compare(a, b, getDuration));

    case FlightSortTypes.Date:
      return flightsCopy.sort((a, b) => compare(a, b, getDepartureTime));

    case FlightSortTypes.Baggage:
      return flightsCopy.sort((a, b) => compare(a, b, getBaggagePrice));

    default:
      return flightsCopy;
  }
});

</script>

<style scoped>
@media screen and (max-width: 1280px) {
  .flights-list {
    width: 100% !important;
  }
}
.flights-list {
  width: 65%;
}
</style>