<script setup lang="ts">
import type { TrendingFlight } from '@/api/types/entities/booking';
import { formatPrice } from '@/lib/format/formatPrice';
import { Months_RU, parseDate } from '@/lib/date/parseDate';
import { GuestRoutes } from '@/router/routes';
import { BASE_API } from '@/store/primaryStore';
import { onMounted, onScopeDispose, ref } from 'vue';

const props = defineProps<{
  flight: TrendingFlight
}>();

const departureTime = parseDate(props.flight.departure_date);
const arrivalTime = parseDate(props.flight.arrival_date);

const currentImage = ref<string>(props.flight.departure_city_image);

let interval: any = null;

onMounted(() => {
  interval = setInterval(() => {
    currentImage.value =
      currentImage.value === props.flight.departure_city_image ?
        props.flight.arrival_city_image :
        props.flight.departure_city_image;
    console.log("image switched");
  }, 4500);
});


onScopeDispose(() => {
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
});

</script>

<template>
  <div
    class="hot-tour-card mt-3 d-flex flex-column justify-content-between"
    @click="
      $router.push(
        {
          name: GuestRoutes.TrendingFlight.name,
          params: { id: flight.flight_id }
        }
      )
    "
  >
    <img
      :src="`${BASE_API}${flight.departure_city_image}`"
      class="hot-tour__image"
      :class="currentImage == flight.departure_city_image ? 'visible' : ''"
    >
    <img
      :src="`${BASE_API}${flight.arrival_city_image}`"
      class="hot-tour__image"
      :class="currentImage == flight.arrival_city_image ? 'visible' : ''"
    >
    <div class="hot-tour__gradient"></div>
    <div class="d-flex justify-content-between" style="z-index: 2;">
      <span class="badge-price">
        от {{ formatPrice(flight.price, "₽") }}
      </span>
      <div class="text-white-50">Цена может быть выше</div>
    </div>
    <div style="z-index: 2;">
      <div class="d-flex gap-3">

        <div class="calendar-badge">
          <span class="calendar-badge-top">
            {{ Months_RU[4].toUpperCase() }}
          </span>
          <div class="calendar-badge-bottom">
            {{ departureTime.days }}
          </div>
        </div>

        <div class="row">
          <div class="col d-flex flex-column align-items-center">
            <span class="fs-5">
              {{ departureTime.hours }}:{{ departureTime.minutes }}
            </span>
            <span class="text-white-50">
              {{ flight.departure_airport_code }}
            </span>
          </div>
          <div class="col d-flex flex-column align-items-center">
            <span class="fs-5">
              {{ arrivalTime.hours }}:{{ arrivalTime.minutes }}
            </span>
            <span class="text-white-50">
              {{ flight.arrival_airport_code }}
            </span>
          </div>
        </div>

      </div>
      <div class="">
        <div class="fw-bold fs-2">
          {{ flight.departure_city_name }} → {{ flight.arrival_city_name }}
        </div>
      </div>
    </div>
  </div>
</template>