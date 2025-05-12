<script setup lang="ts">
import type { TrendingFlight } from '@/api/types/entities/booking';
import HotTourCard from '@/components/views/search/components/HotTourCard.vue';
import HotTourMain from '@/components/views/search/components/HotTourMain.vue';
import '@/assets/style/Trending.css'

const props = defineProps<{
  hotTours: TrendingFlight[] | undefined
}>();

</script>

<template>
  <div class="glass glass-border glass-panel" v-if="hotTours">

    <div class="row g-4">
      <!-- Hot Tour -->
      <div class="col-lg-7 d-flex flex-column">

        <div class="text-start">
          <h4 class="fw-bold mb-2">ГОРЯЧИЕ ТУРЫ</h4>
          <p class="text-white-50">Миллионы мух не могут ошибаться</p>
        </div>

        <HotTourMain :flight="hotTours[0]"/>
      </div>

      <!-- More Routes -->
      <div class="col-lg-5">
        <div class="text-end">
          <h4 class="fw-bold mb-2">ЕЩЁ БОЛЬШЕ МАРШРУТОВ</h4>
          <p class="text-white-50">Выбрали на основе ваших поездок</p>
        </div>
        <div class="row g-3 justify-content-end">
          <div
            class="col-5"
            v-for="flight in hotTours?.slice(1, 5)"
            :key="flight.flight_id"
          >
            <HotTourCard :flight="flight"/>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
