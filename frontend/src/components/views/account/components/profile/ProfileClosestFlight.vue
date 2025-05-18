<template>
  <div v-if="exitsts">
    <div class="d-flex justify-content-between">
      <h3 class="m-0" v-if="!isLastBookingCompleted">
        Поездка
      </h3>
      <h3 class="m-0" v-if="isLastBookingCompleted">
        Поездка завершена
      </h3>
      <InfoBtnIcon class="sm-md-icon" @click="handleInfoClick"/>
    </div>
    <span class="fs-5">
      {{ departureDate }}
    </span>
    <FlightRouteCompact
      v-if="bookingStore.bookings"
      :flight="bookingStore.bookings[0].flight"
    />
  </div>

  <div v-else>
    <h3 class="m-0">
      Нет активных перелётов
    </h3>
  </div>
  
  
</template>

<script setup lang="ts">
import { BookingStatus, type Booking } from '@/api/types/entities/booking';
import InfoBtnIcon from '@/components/icons/InfoBtnIcon.vue';
import FlightRouteCompact from '@/components/shared/FlightRouteCompact.vue';
import { Months_RU, parseDate } from '@/lib/date/parseDate';
import { lowerFirstLetter } from '@/lib/string/switchCaseFirstChar';
import { useBookingModalStore } from '@/store/bookingModalStore';
import { useBookingStore } from '@/store/bookingStore';
import { computed } from 'vue';

const bookingStore = useBookingStore();
const bookingInfoModal = useBookingModalStore();

const exitsts = computed<boolean>(() => {
  if (!bookingStore.bookings || bookingStore.bookings.length === 0) {
    return false;
  }
  return true;
});

const isLastBookingCompleted = computed<boolean | null>(() => {
  if (!exitsts.value) {
    return null;
  }

  return (bookingStore.bookings as Booking[])[0].status !== BookingStatus.Active;
});

const departureDate = computed<string>(() => {
  if (bookingStore.bookings) {
    const date = parseDate(bookingStore.bookings[0].flight.departure_date);
    let month = lowerFirstLetter(Months_RU[date.month]);
    month = month.slice(0, month.length-1) + 'я';
    return `${date.days} ${month}`
  }
  return '';
});

const handleInfoClick = () => {
  if (bookingStore.bookings) {
    bookingInfoModal.visible = true;
    bookingInfoModal.booking = bookingStore.bookings[0];
    console.log('show booking info');
  }
}

</script>

<style scoped>

</style>