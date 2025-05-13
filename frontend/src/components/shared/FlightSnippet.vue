<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import FlightOff from '@/components/icons/FlightOff.vue';
import FlightLanding from '@/components/icons/FlightLanding.vue';
import { Months_RU, parseDate } from '@/lib/date/parseDate';
import { deltaDate } from '@/lib/date/deltaDates';

const props = defineProps<{
  flight: Flight;
}>();

const departureDate = parseDate(props.flight.departure_date);
const arrivalDate = parseDate(props.flight.arrival_date);
const delta = deltaDate(props.flight.departure_date, props.flight.arrival_date);

</script>

<template>
  <div class="d-flex" v-bind="$attrs">
    <div class="p-0 text-start float-start">
      <span class="fs-2 fw-bold">
        {{ departureDate.hours }}:{{ departureDate.minutes }}
      </span>
      <span class="flight-snippet-details">
        {{ flight.departure_city.name }}
      </span>
      <span class="flight-snippet-details">
        {{ departureDate.days }} {{ Months_RU[departureDate.month] }}
      </span>
    </div>
    <div class="d-flex flex-column align-items-start flex-fill flight-snippet-view">
      <div class="d-flex justify-content-between align-items-end w-100 h-100">
        <div class="text-start">
          <FlightOff class="flight-icon" />
          <span class="text-white-50">
            {{ flight.departure_city.airport?.code ?? "" }}
          </span>
        </div>
        <span class="mb-3 fw-bolder text-white-50">
          {{ delta?.hours }}h {{ delta?.minutes }}m
        </span>
        <div class="text-end">
          <FlightLanding class="flight-icon" />
          <span class="text-white-50">
            {{ flight.arrival_city.airport?.code ?? "" }}
          </span>
        </div>
      </div>
      <hr class="w-100">
    </div>
    <div class="p-0 text-end">
      <span class="fs-2 fw-bold">
        {{ arrivalDate.hours }}:{{ arrivalDate.minutes }}
      </span>
      <span class="flight-snippet-details">
        {{ flight.arrival_city.name }}
      </span>
      <span class="flight-snippet-details">
        {{ arrivalDate.days }} {{ Months_RU[arrivalDate.month] }}
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Flight snippet */
.flight-icon {
  width: 2rem;
  fill: var(--glass-text-transparent);
}
.flight-snippet-details {
  font-size: 1.1rem;
}
.flight-snippet-view {
  padding: 0 0.7rem;
}
</style>