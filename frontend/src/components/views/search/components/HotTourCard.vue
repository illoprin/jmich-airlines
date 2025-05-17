<script setup lang="ts">
import type { TrendingFlight } from '@/api/types/entities/booking';
import { formatPrice } from '@/lib/format/formatPrice';
import { GuestRoutes } from '@/router/routes';
import { BASE_API } from '@/store/primaryStore';

defineProps<{
  flight: TrendingFlight
}>();

</script>

<template>
  <div
    class="destination-card"
    :style="`
      background-image:
        linear-gradient(to bottom, transparent, var(--black-transparent)),
      url(${BASE_API}${flight.arrival_city_image});
    `"
    @click="
      $router.push(
        { name: GuestRoutes.TrendingFlight.name, params: { id: flight.flight_id } }
      )"
  >
    <div class="d-flex flex-column">
      <span class="fs-5 lh-sm">
        {{ flight.arrival_city_name }}
      </span>
      <div class="">
        <span class="text-white-50 lh-sm">
          от
        </span>
        <strong class="fs-5 lh-sm">
          {{ formatPrice(flight.price, "₽") }}
        </strong>
      </div>
    </div>
  </div>

</template>