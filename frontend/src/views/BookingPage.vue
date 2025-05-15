<template>
  <div class="container" v-if="flight !== undefined">
    <!-- Title -->
    <h1 class="text-center fw-bold mb-5 mt-3">Давайте купим билет</h1>

    <div class="glass glass-border section-base">
      <div class="section-link">
        <GlassLink @click="$router.go(-1)">
          Назад
        </GlassLink>
      </div>
      <div class="glass glass-border light-shadow top-bar">
        <div class="top-bar-left">
          <div class="d-flex gap-5">
            <img
              :src="`${BASE_API}${flight.company.logo}`"
              :alt="flight.company.name"
              class="company-logo"
            >
            <div class="w-75">
              <div class="fs-2 fw-bold">
                {{ flight.company.name }}
              </div>
              <div class="fs-5 fw-bold">
                {{ flight.route_code }}
              </div>
            </div>
            <PurchaseTrigger
              :flight="flight"
            />
          </div>

          <FlightRouteDetailed :flight="flight"/>
        </div>
        <div class="top-bar-right flex-fill">
          <StepperInput
            v-model:value="baggageWeight"
            placeholder="Укажите число"
            :min="0"
            :max="40"
          >
            Багаж
          </StepperInput>
          <StepperInput
            v-model:value="seats"
            placeholder="Укажите число"
            :min="1"
            :max="flight.seats_available"
          >
            Количество мест
          </StepperInput>
        </div>

        
      </div>
      
      <div class="bottom-bar">
        <div class="glass glass-border light-shadow bottom-bar-left">
          <BookingPaymentForm />

          <div>
            <h3>
              Промокод
            </h3>
            <div class="d-flex gap-3 mt-3">
                <GlassInput type="text" class="small w-75" placeholder="Промокод"/>
                <GlassButtonSmall class="fs-5">
                  Применить
                </GlassButtonSmall>
              </div>
          </div>
        </div>
        <div class="glass glass-border light-shadow bottom-bar-right">
          
        </div>      
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import FlightRouteDetailed from '@/components/shared/FlightRouteDetailed.vue';
import PurchaseTrigger from '@/components/shared/PurchaseTrigger.vue';
import GlassLink from '@/components/UI/GlassLink.vue';
import { useFetching } from '@/composable/useFetching';
import { GuestRoutes } from '@/router/routes';
import { FlightService } from '@/service/FlightService';
import { BASE_API } from '@/store/store';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StepperInput from '@/components/views/booking/StepperInput.vue';
import MirIcon from '@/components/icons/MirIcon.vue';
import GlassInput from '@/components/UI/GlassInput.vue';
import GlassCheckbox from '@/components/UI/GlassCheckbox.vue';
import GlassButtonSmall from '@/components/UI/GlassButtonSmall.vue';
import BookingPaymentForm from '@/components/views/booking/BookingPaymentForm.vue';

const route = useRoute();
const router = useRouter();

const flight = ref<Flight | undefined>(undefined);

const baggageWeight = ref<number>(parseInt(route.query.bw as any) || 0);
const seats = ref<number>(1);
const saveCard = ref<boolean>(false);

const flightId = parseInt(route.params.id as string);
const {
  fetchData: fetchFlight
} = useFetching(async () => {
  try {
    flight.value = await FlightService.getByID(flightId);
  } catch {
    router.push({ name: GuestRoutes.Search.name });
  }
});

onMounted(() => {
  fetchFlight();
});
</script>

<style scoped>
@media screen and (max-width: 1080px) {
  .bottom-bar {
    flex-direction: column;
  }
}

@media screen and (max-width: 1280px) {
  .top-bar {
    flex-direction: column !important;
  }
}

.section-link {
  padding: 0.5rem;
}
.section-base {
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
  padding: 1.6rem;
}

.top-bar {
  padding: 1.6rem;
  display: flex;
  flex-flow: row nowrap;
  gap: calc(var(--base-padding) * 3);
}
.top-bar-left {
  flex-grow: 10;
  display: flex;
  flex-flow: column nowrap;
  gap: 1rem;
}
.top-bar-right {
  flex-grow: 0.25;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}

.bottom-bar {
  display: flex;
  gap: 1rem;
}
.bottom-bar-left {
  flex-grow: 1;
  padding: 1.6rem;
}
.bottom-bar-right {
  flex-grow: 1.5;
  padding: 1.6rem;
}


</style>