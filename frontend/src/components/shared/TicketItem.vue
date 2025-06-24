<template>
  <div class="glass glass-border glass-padding d-flex gap-4 ticket-item">
    <div class="flex-fill">
      <div class="d-flex justify-content-between">
      <StatusBadge
          :ticketStatus="ticket.status"
          :flightStatus="ticket.flight.status"
        />
  
        <div class="d-flex gap-3 align-items-center">
          <span class="fs-4">
            {{ ticket.flight.company.name }}
          </span>
          <img
            :src="`${BASE_API}${ticket.flight.company.logo}`"
            class="company-logo-small"
            alt="company-logo"
          >
        </div>
      </div>
  
      <FlightRouteDetailed :flight="ticket.flight" class="mt-3"/>
    </div>

    <!-- If ticket active -->
    <div
      class="w-auto d-flex gap-3"
      v-if="ticket.flight.status === FlightStatus.Active && ticket.status === BookingStatus.Active"
    >
      <div class="glass p-3 glass-border shadow">
        <img :src="ticket.qr_code" alt="booking-qr" class="qr-code rounded">
      </div>
      <div class="d-flex flex-column gap-3">
        <GlassButtonSmall class="flex-fill" @click="handleInfoButton(ticket)">
          <img :src="InfoIco" alt="info-ico" class="sm-md-icon">
        </GlassButtonSmall>
        <GlassButtonSmall class="flex-fill" @click="handleCancelButton(ticket)">
          <img :src="CrossIco" alt="info-ico" class="sm-md-icon">
        </GlassButtonSmall>
      </div>
    </div>

    <!-- If ticket cancelled -->
    <div
      class="d-flex flex-column align-items-center"
      v-if="(ticket.flight.status === FlightStatus.Canceled
      || ticket.flight.status === FlightStatus.Delayed)
      && ticket.status !== BookingStatus.Completed"
    >
      <h1 class="mb-auto fw-bold fs-2">{{ formatPrice(ticket.cost, "₽") }}</h1>
      <div class="d-flex gap-3">
        <GlassButtonSmall class="flex-fill fs-5" @click="handleRefundButton(ticket)">
          Возврат средств
        </GlassButtonSmall>
        <GlassButtonSmall class="flex-fill" @click="handleInfoButton(ticket)">
          <img :src="InfoIco" alt="info-ico" class="sm-md-icon">
        </GlassButtonSmall>
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">
import { BookingStatus, type Booking } from '@/api/types/entities/booking';
import FlightRouteDetailed from '@/components/shared/FlightRouteDetailed.vue';
import StatusBadge from '@/components/shared/StatusBadge.vue';
import GlassButtonSmall from '@/components/UI/GlassButtonSmall.vue';
import InfoIco from '@/assets/icons/info-stroke.svg'
import CrossIco from '@/assets/icons/cross.svg'
import { BASE_API } from '@/store/primaryStore';
import { FlightStatus } from '@/api/types/entities/flight';
import { formatPrice } from '@/lib/format/formatPrice';
import { useBookingModalStore } from '@/store/bookingModalStore';
import { useBookingRefundStore } from '@/store/bookingRefundStore';
import { BookingRefundTypes } from '@/types/sort/bookingRefundTypes';

const bookingModal = useBookingModalStore();
const bookingRefundModal = useBookingRefundStore();

const props = defineProps<{
  ticket: Booking
}>();

const handleInfoButton = (booking: Booking) => {
  bookingRefundModal.visible = false;
  bookingModal.visible = true;
  bookingModal.booking = booking;
};

const handleCancelButton = (booking: Booking) => {
  bookingModal.visible = false;
  bookingRefundModal.type = BookingRefundTypes.Cancel;
  bookingRefundModal.visible = true;
  bookingRefundModal.booking = booking;
};

const handleRefundButton = (booking: Booking) => {
  bookingModal.visible = false;
  bookingRefundModal.type = BookingRefundTypes.Refund;
  bookingRefundModal.visible = true;
  bookingRefundModal.booking = booking;
}

</script>

<style scoped>
@media screen and (max-width: 1080px) {
  .ticket-item {
    flex-direction: column;
  }
}
.qr-code {
  width: 10rem;
  height: 10rem;
  mix-blend-mode: multiply;
}
.ticket-item {
  user-select: none;
  transition: transform 300ms;
  will-change: transform;
}
.ticket-item:hover {
  transform: scale(1.02);
  z-index: 2;
}
</style>