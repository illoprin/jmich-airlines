<template>
  <!-- Sort panel -->
  <!-- <div class="glass-convex glass-border glass-padding">

  </div> -->

  <!-- Tickets -->
  <div
    class="glass-convex glass-border glass-padding d-flex flex-column gap-3"
    v-if="bookingStore.bookings"
  >
    <TicketItem
      v-for="ticket in bookingStore.bookings"
      :key="ticket.id"
      :ticket="ticket"
    />
  </div>
</template>

<script setup lang="ts">
import TicketItem from '@/components/shared/TicketItem.vue';
import { useBookingStore } from '@/store/bookingStore';

const bookingStore = useBookingStore();
</script>

<style scoped></style>