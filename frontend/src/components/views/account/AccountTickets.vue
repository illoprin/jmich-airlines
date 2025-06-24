<template>
  <div class="glass-convex glass-border glass-padding d-flex flex-column gap-3" v-if="bookingStore.bookings">
    <!-- Filter -->
    <GlassFancyRadioHorizontal
      :options="sortTypes"
      v-model:value="sort"
    />
    <!-- If empty -->
    <RouterLink
      :to="GuestRoutes.Search.path"
      class="text-white fw-bold fs-3 text-center w-100 p-5"
      v-if="!bookingStore.bookings || bookingStore.bookings.length === 0"
    >
      На страницу поиска
    </RouterLink>
    <!-- Tickets -->
    <TicketItem v-for="ticket in bookingsSorted" :key="ticket.id" :ticket="ticket" />
  </div>

  <!-- Refund Modal -->
  <BookingRefundModal />
</template>

<script setup lang="ts">
import { BookingStatus, type Booking } from '@/api/types/entities/booking';
import BookingRefundModal from '@/components/shared/BookingRefundModal.vue';
import TicketItem from '@/components/shared/TicketItem.vue';
import GlassFancyRadioHorizontal from '@/components/UI/GlassFancyRadioHorizontal.vue';
import { GuestRoutes } from '@/router/routes';
import { useBookingStore } from '@/store/bookingStore';
import { BookingsFilterTypes } from '@/types/sort/bookingsFilterTypes';
import type { DefaultOption } from '@/types/ui/fancyRadio';
import { computed, ref } from 'vue';

const bookingStore = useBookingStore();

const sort = ref<string>(BookingsFilterTypes.All);

const sortTypes: DefaultOption[] = [
  {
    label: "Все",
    value: BookingsFilterTypes.All,
  },
  {
    label: "Активные",
    value: BookingsFilterTypes.Active,
  },
  {
    label: "Завершённые",
    value: BookingsFilterTypes.Completed,
  },
  {
    label: "Отменённые",
    value: BookingsFilterTypes.Cancelled,
  },
];

const bookingsSorted = computed<Booking[]>(() => {
  if (bookingStore.bookings) {
    switch (sort.value) {
      case BookingsFilterTypes.All:
        return bookingStore.bookings
      case BookingsFilterTypes.Active:
        return [...bookingStore.bookings].filter(booking => booking.status == BookingStatus.Active)
      case BookingsFilterTypes.Completed:
        return [...bookingStore.bookings].filter(booking => booking.status == BookingStatus.Completed)
      case BookingsFilterTypes.Cancelled:
        return [...bookingStore.bookings].filter(booking => booking.status == BookingStatus.Cancelled)
    }
  }
  return []
})

</script>

<style scoped></style>