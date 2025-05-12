<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import GlowButton from '@/components/UI/GlowButton.vue';
import GlassDropDown from '@/components/UI/GlassDropDown.vue';
import type { Option } from '@/types/ui/option.ts';
import type { FlightSearchPayload } from '@/api/types/requests/flight';
import CityDropDown from '@/components/shared/CityDropDown.vue';
import { useFetching } from '@/composable/useFetching';
import type { Airport, City } from '@/api/types/entities/city';
import { CityService } from '@/service/CityService';
import GlassDateInput from '@/components/UI/GlassDateInput.vue';

const props = defineProps<{
  onSubmit: (searchFormData: FlightSearchPayload) => void;
}>();

const cities = ref<City[] | undefined>(undefined);
const formData = reactive<FlightSearchPayload>({});

const {
  fetchData: fetchCities,
  isLoading: isLoadingCities,
  error: citiesFetchingError,
} = useFetching(async () => {
  const result = await CityService.getCities();
  cities.value = result;
});

const handleSubmit = () => {
  console.log("submit", formData);
  props.onSubmit(formData);
}

onMounted(async () => {
  await fetchCities();
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
    class="search-panel d-flex flex-wrap gap-2 justify-content-between align-items-center mb-5"
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
      class="flex-fill" 
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
