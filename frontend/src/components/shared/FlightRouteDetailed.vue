<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import { Months_RU, parseDate } from '@/lib/date/parseDate';
import { deltaDate } from '@/lib/date/deltaDates';
import Plane from '@/components/icons/Plane.vue';

const props = defineProps<{
  flight: Flight;
}>();

const departureDate = parseDate(props.flight.departure_date);
const arrivalDate = parseDate(props.flight.arrival_date);
const delta = deltaDate(props.flight.departure_date, props.flight.arrival_date);

</script>

<template>
  <div class="d-flex" v-bind="$attrs">
    <div class="text-start float-start flight-route-left-details">
      <span class="fs-2 fw-bold">
        {{ departureDate.hours }}:{{ departureDate.minutes }}
      </span>
      <span class="flight-route-details">
        {{ flight.departure_city.name }}
      </span>
      <span class="flight-route-details">
        {{ departureDate.days }} {{ Months_RU[departureDate.month] }}
      </span>
    </div>
    <div class="d-flex align-items-center flex-fill flight-route-view gap-3">
      <div class="flex-fill">
        <span class="text-white-50 fs-4">
          {{ flight.departure_city.airport?.code ?? '' }}
        </span>
        <hr class="w-100">
        <span class="text-white-50 fs-4">
          {{ flight.departure_city.airport?.name ?? '' }}
        </span>
      </div>
      <div
        class="d-flex flex-column justify-content-center align-items-center gap-2"
      >
        <span class="text-white-50 fs-5">
          {{ delta?.hours }}h {{ delta?.minutes }}m
        </span>
        <Plane class="flight-icon transparent-icon" />
      </div>
      <div class="flex-fill text-end">
        <span class="text-white-50 fs-4">
          {{ flight.arrival_city.airport?.code ?? '' }}
        </span>
        <hr class="w-100">
        <span class="text-white-50 fs-4">
          {{ flight.arrival_city.airport?.name ?? '' }}
        </span>
      </div>
    </div>
    <div class="text-end flight-route-right-details">
      <span class="fs-2 fw-bold">
        {{ arrivalDate.hours }}:{{ arrivalDate.minutes }}
      </span>
      <span class="flight-route-details">
        {{ flight.arrival_city.name }}
      </span>
      <span class="flight-route-details">
        {{ arrivalDate.days }} {{ Months_RU[arrivalDate.month] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.flight-icon {
  width: 2rem;
}

.flight-route-details {
  font-size: 1.3rem;
  color: var(--glass-text-transparent);
}

.flight-route-view {
  padding: 0 var(--base-padding);
}

.flight-route-left-details {
  border-right: solid 2px var(--glass-stroke);
  padding-right: var(--base-padding);
}

.flight-route-right-details {
  border-left: solid 2px var(--glass-stroke);
  padding-left: var(--base-padding);
}
</style>