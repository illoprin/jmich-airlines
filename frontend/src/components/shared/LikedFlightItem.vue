<template>
  <div
    class="glass glass-border glass-padding d-flex gap-5"
  >
    <img
      :src="`${BASE_API}${flight.company.logo}`"
      :alt="flight.company.name"
      class="company-logo"
    />

    <FlightRouteCompact :flight="flight" class="flex-fill" :printDate="true"/>

    <div class="d-flex flex-column justify-content-between">
      <h1 class="fs-2 fw-bold text-center">{{ formatPrice(flight.price, '₽') }}</h1>
      <div class="d-flex gap-3">
        <GlassButtonSmall @click="$router.push({name: AuthRoutes.BookingPage.name, params: {id: flight.id}})">
          Приобрести
        </GlassButtonSmall>
        <GlassButtonSmall @click="handleDislike">
          <img :src="TrashIcon" alt="dislike" class="sm-md-icon">
        </GlassButtonSmall>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import FlightRouteCompact from '@/components/shared/FlightRouteCompact.vue';
import GlassButtonSmall from '@/components/UI/GlassButtonSmall.vue';
import { formatPrice } from '@/lib/format/formatPrice';
import { BASE_API } from '@/store/primaryStore';
import TrashIcon from '@/assets/icons/trash-bin.svg'
import { AuthRoutes } from '@/router/routes';
import { useLikedStore } from '@/store/likedFlightsStore';

const props = defineProps<{
  flight: Flight,
}>();

const likedFlight = useLikedStore();

const handleDislike = async () => {
  await likedFlight.syncDislikeToServer(props.flight.id);
  await likedFlight.fetchLikes();
}

</script>

<style scoped></style>