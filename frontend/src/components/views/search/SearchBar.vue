<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import GlowButton from '@/components/UI/GlowButton.vue';
import type { FlightSearchPayload } from '@/api/types/requests/flight';
import CityDropDown from '@/components/shared/CityDropDown.vue';
import { useFetching } from '@/composable/useFetching';
import type { Airport, City } from '@/api/types/entities/city';
import GlassDateInput from '@/components/UI/GlassDateInput.vue';
import { useCities } from '@/store/cityStore';

const props = defineProps<{
  onSubmit: (searchFormData: FlightSearchPayload) => void;
}>();

const citiesHook = useCities();
const cities = ref<City[] | null>(null);
const formData = reactive<FlightSearchPayload>({});

const {
  fetchData: fetchCities,
  isLoading: isLoadingCities,
  error: citiesFetchingError,
} = useFetching(async () => {
  const result = await citiesHook.fetchCities();
  cities.value = result;
});

const handleSubmit = () => {
  console.log("submit", formData);
  props.onSubmit(formData);
}

onMounted(() => {
  fetchCities();
});

function selectDepartureAirport(airport: Airport) {
  if (airport.id !== formData.arrival_airport_id) {
    formData.departure_airport_id = airport.id;
  }
}

function selectArrivalAirport(airport: Airport) {
  if (airport.id !== formData.departure_airport_id) {
    formData.arrival_airport_id = airport.id;
  }
}
</script>

<template>
  <div
    class="search-panel d-flex gap-2 justify-content-between align-items-center mb-5"
    v-if="!isLoadingCities"
  >

    <CityDropDown
      :onSelect="selectDepartureAirport"
      :invalidValue="formData.arrival_airport_id ?? 0"
      :cities="cities || []"
    >
      <template v-slot:dropdown-text>
        Откуда
      </template>
    </CityDropDown>

    <CityDropDown
      :invalidValue="formData.departure_airport_id ?? 0"
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
      v-model:input="formData.departure_date"
    />

    <input
      type="number"
      placeholder="Количество мест"
      class="flex-fill glass glass-border w-auto form-glass"
      v-model="formData.seats"
      min="1"
    />

    <GlowButton @click="handleSubmit">Найти билеты</GlowButton>
    
  </div>
</template>

<style scoped></style>
