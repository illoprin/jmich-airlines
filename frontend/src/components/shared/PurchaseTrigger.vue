<template>
  <div
    class="purchase-trigger"
    :class="purchaseTriggerCls"
  >
    <img :src="ClockIco" alt="clock-ico" class="md-icon" v-if="timer">
    <img :src="TicketIco" alt="ticket-ico" class="md-icon" v-if="tickets">
    {{ label }}
  </div>
</template>

<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import ClockIco from '@/assets/icons/clock.svg'
import { DEP_TIME_MIN_DIFFERENCE, HOUR_MILLISECONDS, MIN_SEATS } from '@/store/primaryStore';
import TicketIco from '@/assets/icons/ticket.svg'
import { computed } from 'vue';

const props =defineProps<{
  flight: Flight
}>();

const depDelta = () => {
  const dep = new Date(props.flight.departure_date).getTime();
  const now = Date.now();
  return dep - now;
};

const tickets = computed<boolean>(() => {
  return props.flight.seats_available < MIN_SEATS
});

const timer = computed<boolean>(() => {
  return depDelta() < DEP_TIME_MIN_DIFFERENCE;
});

const label = computed<string>(() => {
  if (tickets.value) {
    return `Осталось менее ${MIN_SEATS} билетов по этой цене`;
  } else if (timer.value) {
    const hours = Math.floor(depDelta() / HOUR_MILLISECONDS);
    return `До окончания регистрации осталось менее ${hours} часов`;
  }
  return ``
});

const purchaseTriggerCls = computed<string>(() => {
  if (tickets.value) {
    return 'tickets';
  } else if (timer.value) {
    return 'timer';
  }
  return '';
});

</script>

<style scoped>
.purchase-trigger {
  user-select: none;
  padding: 1.25rem;
  display: flex;
  gap: 1rem;
  align-items: start;

  
  font-weight: 500;
  border-radius: 1rem;
  font-size: 1rem;
  text-wrap: wrap;
  text-align: start;
  line-height: 1.5em;

  max-width: 22rem;

  animation: 2s ease-in alternate infinite pulse;
}
.purchase-trigger.tickets {
  background: linear-gradient(151deg, var(--accent-2) 0%, var(--accent-1) 100%);

  box-shadow: inset 0px -10px 20px rgba(243, 244, 228, 0.389),
  7px 10px 30px rgba(230, 190, 12, 0.719),
  4px 5px 100px rgba(224, 111, 6, 0.234);
}
.purchase-trigger.timer {
  background: linear-gradient(151deg, var(--red-accent-1) 0%, var(--red-accent-2) 100%);

  box-shadow: inset 0px -10px 20px rgba(243, 244, 228, 0.389),
  0px 10px 50px #EA724D;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(none);
  }
  100% {
    filter: drop-shadow(0px 7px 30px rgba(231, 117, 11, 0.3));
    transform: scale(1.1);
  }
}
</style>