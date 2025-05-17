<template>
  <div
    class="status-badge"
    :class="combinedFlightStatus.class"
  >
    {{ combinedFlightStatus.label }}
  </div>
</template>

<script setup lang="ts">
import { BookingStatus } from '@/api/types/entities/booking';
import { FlightStatus } from '@/api/types/entities/flight';
import { computed } from 'vue';

const props = defineProps<{
  ticketStatus: BookingStatus;
  flightStatus: FlightStatus;
}>();

const combinedFlightStatus = computed<{class: string, label: string}>(() => {
  const ticket = props.ticketStatus;
  const flight = props.flightStatus;

  if (ticket === BookingStatus.Cancelled) {
    return {class: 'cancelled', label: 'Отменён'};
  }

  if (ticket === BookingStatus.Completed) {
    return {class: 'completed', label: 'Завершён'};
  }

  if (flight === FlightStatus.Canceled) {
    return {class: 'cancelled', label: 'Отменён'};
  }

  if (flight === FlightStatus.Delayed) {
    return {class: 'delayed', label: 'Задерживается'};
  }

  if (flight === FlightStatus.Completed) {
    return {class: 'completed', label: 'Завершён'};
  }

  return {class: 'active', label: 'Активен'}; // fallback
});

</script>

<style scoped>
.status-badge {
  user-select: none;
  padding: calc(var(--index) * .15) calc(var(--index) * .5);
  font-weight: 600;
  font-size: calc(var(--index) * 1.2);
  color: #2C88D8;
  border-radius: 10px;

  box-shadow: inset 0px 5px 20px var(--glass-panel-active),
  0 10px 20px rgba(3, 58, 80, 0.192);
}
.status-badge.active {
  background: linear-gradient(170deg, var(--green-accent-1), var(--green-accent-2));
}
.status-badge.cancelled {
  background: linear-gradient(120deg, var(--red-accent-1), var(--red-accent-2));
}
.status-badge.delayed {
  background: linear-gradient(120deg, var(--accent-2), var(--accent-1));
}
.status-badge.completed {
  background: linear-gradient(120deg, var(--green-accent-1), var(--green-accent-2));
}
</style>