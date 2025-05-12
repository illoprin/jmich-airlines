<script setup lang="ts">
import GlowButton from "@/components/UI/GlowButton.vue";
import GlassDropDown from "@/components/UI/GlassDropDown.vue";
import type { Option } from "@/types/ui/option.ts";
import type { FlightSearchPayload } from "@/api/types/requests/flgiht.ts";

const props = defineProps<{
  onSubmit: (searchFormData: FlightSearchPayload) => void;
}>();

const cities: Option[] = [
  { title: "Samara", value: "1" },
  { title: "Moscow", value: "2" },
  { title: "Paris", value: "3" },
];

function selectDepartureCity(option: Option) {
  console.log(option);
}

function selectArrivalCity(option: Option) {
  console.log(option);
}

</script>

<template>
  <div class="search-panel d-flex flex-wrap gap-2 justify-content-between align-items-center mb-5">
    <GlassDropDown :options="cities" :on-select="selectDepartureCity">
      Откуда
    </GlassDropDown>
    <GlassDropDown :options="cities" :on-select="selectArrivalCity">
      Куда
    </GlassDropDown>
    <input
      type="date"
      class="flex-fill glass-border glass form-glass"
    />
    <input type="number" class="flex-fill glass glass-border w-auto form-glass">
    <GlowButton @click="onSubmit">Найти билеты</GlowButton>
  </div>
</template>

<style scoped>

</style>