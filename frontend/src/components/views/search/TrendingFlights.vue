<script setup lang="ts">
import type { TrendingFlight } from '@/api/types/entities/booking';
import HotTourCard from '@/components/views/search/components/HotTourCard.vue';
import HotTourMain from '@/components/views/search/components/HotTourMain.vue';
import '@/assets/style/Trending.css'
import GlassPanelHeader from '@/components/shared/GlassPanelHeader.vue';

const props = defineProps<{
  hotTours: TrendingFlight[]
}>();

</script>

<template>
  <div class="glass glass-border glass-padding">

    <div class="row g-4">
      <!-- Hot Tour -->
      <div class="col-lg-7 d-flex flex-column">

        <GlassPanelHeader>
          <template v-slot:header>
            ГОРЯЧИЕ ТУРЫ
          </template>
          <template v-slot:subheader>
            Миллионы мух не могут ошибаться
          </template>
        </GlassPanelHeader>

        <HotTourMain :flight="hotTours[0]"/>
      </div>

      <!-- More Routes -->
      <div class="col-lg-5">
        <GlassPanelHeader align="end">
          <template v-slot:header>
            ЕЩЁ БОЛЬШЕ МАРШРУТОВ
          </template>
          <template v-slot:subheader>
            Выбрали на основе ваших поездок
          </template>
        </GlassPanelHeader>
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
