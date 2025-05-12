<script setup lang="ts">

import type { Airport, City } from '@/api/types/entities/city';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import MapPinIcon from '@/assets/icons/map-pin.svg'
import AirportIcon from '@/assets/icons/airport.svg'

const props = defineProps<{
  cities: City[],
  invalidValue: number,
  onSelect: (selected: Airport) => void,
}>();

const listRoot = ref<HTMLElement | undefined>(undefined);

const selectedAirport = ref<Airport | undefined>(undefined);
const isOpen = ref<boolean>(false);

const handleSelect = (airport: Airport) => {
  if (airport.id === props.invalidValue) {
    return;
  }
  selectedAirport.value = airport;
  props.onSelect(airport);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    listRoot.value !== undefined 
    && !listRoot.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <div class="flex-fill" style="position: relative" ref="listRoot">
    <button
      class="glass w-100 glass-border form-glass text-start"
      @click="() => (isOpen = !isOpen)"
    >
      <span v-if="!selectedAirport" class="text-white-50">
        <slot
          name="dropdown-text"
        />
      </span>
      <span class="d-flex justify-content-between" v-else>
        <div>
          {{ selectedAirport.name }}
        </div>
        <div class="text-white-50">
          {{ selectedAirport.code }}
        </div>
      </span>
    </button>
    <ul
      class="glass glass-border glass-dropdown-list"
      v-if="isOpen"
    >
      <div
        v-for="(city, cityIndex) in cities"
        :key="city.id"
      >
        <li 
          class="glass-dropdown-element" 
          :class="cityIndex == 0 ? 'first' : ''"
          disabled
        >
          <img
            :src="MapPinIcon"
            class="small-icon"
            alt="map-pin"
          >
          {{ city.name }}
        </li>
        <li
          class="glass-dropdown-element glass-dropdown-subelement"
          v-for="(airport, airportIndex) in city.airports"
          :class="
            airportIndex === city.airports?.length - 1
             && cityIndex === cities.length - 1 ? 'last' : ''
          "
          :key="airport.id"
          @click="handleSelect(airport)"
        >
          <img
            :src="AirportIcon"
            class="small-icon"
            alt="airport"
          >
          {{ airport.name }}
          <span class="d-block text-white-50 city-dropdown__airport-code">
            {{ airport.code }}
          </span>
        </li>

      </div>

    </ul>
  </div>
</template>

<style scoped>
.glass-dropdown-subelement {
  padding-left: 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.small-icon {
  margin-right: 0.2rem;
}
.city-dropdown__airport-code {
  margin-left: auto;
}
</style>