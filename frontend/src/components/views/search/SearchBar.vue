<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import GlowButton from '@/components/UI/GlowButton.vue';
import CityDropDown from '@/components/shared/CityDropDown.vue';
import { useFetching } from '@/composable/useFetching';
import type { Airport, City } from '@/api/types/entities/city';
import GlassDateInput from '@/components/UI/GlassDateInput.vue';
import { useCities } from '@/store/cityStore';
import { useSearchFlightStore } from '@/store/searchFlightStore';
import GlassInput from '@/components/UI/GlassInput.vue';

const citiesHook = useCities();
const cities = ref<City[] | null>(null);
const searchStore = useSearchFlightStore();

const {
  fetchData: fetchCities,
  isLoading: isLoadingCities,
} = useFetching(async () => {
  const result = await citiesHook.fetchCities();
  cities.value = result;
});

const handleSubmit = async () => {
  await searchStore.searchFlights();
}

onMounted(() => {
  fetchCities();
});

function selectDepartureAirport(airport: Airport) {
  if (airport.id !== searchStore.query.arrival_airport_id) {
    searchStore.setQuery({ ...searchStore.query, departure_airport_id: airport.id })
  }
}

function selectArrivalAirport(airport: Airport) {
  if (airport.id !== searchStore.query.departure_airport_id) {
    searchStore.setQuery({ ...searchStore.query, arrival_airport_id: airport.id })
  }
}
</script>

<template>
  <div
    class="search-panel d-flex gap-2 justify-content-between align-items-center"
    v-if="!isLoadingCities"
    v-bind="$attrs"
  >

    <CityDropDown
      :onSelect="selectDepartureAirport"
      :invalidValue="searchStore.query.arrival_airport_id ?? 0"
      :cities="cities || []"
    >
      <template v-slot:dropdown-text>
        Откуда
      </template>
    </CityDropDown>

    <CityDropDown
      :invalidValue="searchStore.query.departure_airport_id ?? 0"
      :onSelect="selectArrivalAirport"
      :cities="cities || []"
    >
      <template v-slot:dropdown-text>
        Куда
      </template>
    </CityDropDown>

    <GlassDateInput 
      class="w-auto flex-fill" 
      :min="new Date()" 
      v-model:value="searchStore.query.departure_date"
    />

    <GlassInput
      type="number"
      placeholder="Количество мест"
      class="flex-fill glass glass-border w-auto form-glass"
      v-model:value="searchStore.query.seats"
      min="1"
    />

    <GlowButton @click="handleSubmit">Найти билеты</GlowButton>
    
  </div>
</template>

