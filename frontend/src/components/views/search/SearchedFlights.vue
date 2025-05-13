<template>

  <div class="d-flex gap-3 flex-wrap align-items-baseline">
    <!-- Sort panel -->
    <div class="glass glass-border glass-panel flex-fill">
      <GlassPanelHeader>
        <template v-slot:header>
          Сортировка
        </template>
      </GlassPanelHeader>
    </div>
    <!-- Flights -->
    <div class="flights-list glass glass-border glass-panel">
      <GlassPanelHeader>
        <template v-slot:header>
          Мы нашли {{ flights.length }} рейсов
        </template>
      </GlassPanelHeader>
      <div class="d-flex gap-3 flex-column">
        <SearchedFlightItem
          v-for="flight in flights"
          :flight="flight"
          :likeCallback="handleLike"
          :dislikeCallback="handleDislike"
          :isFlightLiked="isFlightLiked"
        />
      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import GlassPanelHeader from '@/components/shared/GlassPanelHeader.vue';
import SearchedFlightItem from '@/components/views/search/components/SearchedFlightItem.vue';

defineProps<{
  flights: Flight[];
}>();

const sortedFlights = (): Flight[] => {
  return [];
};

const handleLike = (flight: Flight) => {
  console.log("like", flight.id);
}

const handleDislike = (flight: Flight) => {
  console.log("dislike", flight.id);
}

const isFlightLiked = (flight: Flight) => {
  // TODO
  return false;
}

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