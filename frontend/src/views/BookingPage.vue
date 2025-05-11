<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const flightId = route.params.id;
</script>

<template>
  <h1>Booking {{ flightId }}</h1>
</template>
