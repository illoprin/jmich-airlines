<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import FlightRouteDetailed from '@/components/shared/FlightRouteDetailed.vue';
import PurchaseTrigger from '@/components/shared/PurchaseTrigger.vue';
import GlassLink from '@/components/UI/GlassLink.vue';
import { useFetching } from '@/composable/useFetching';
import { AuthRoutes, GuestRoutes } from '@/router/routes';
import { FlightService } from '@/service/FlightService';
import { BASE_API } from '@/store/primaryStore';
import { computed, onMounted, onScopeDispose, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StepperInput from '@/components/views/booking/StepperInput.vue';
import GlassInput from '@/components/UI/GlassInput.vue';
import GlassButtonSmall from '@/components/UI/GlassButtonSmall.vue';
import BookingPaymentForm from '@/components/views/booking/BookingPaymentForm.vue';
import { useBookingForm } from '@/store/bookingFormStore';
import GlowButton from '@/components/UI/GlowButton.vue';
import type { CreateBookingPayload } from '@/api/types/requests/booking';
import { DiscountService } from '@/service/DiscountService';
import BookingTotalCost from '@/components/views/booking/BookingTotalCost.vue';
import { useUserStore } from '@/store/userStore';
import { UserLevel } from '@/api/types/entities/user';
import { AccountPageModes } from '@/types/hash/account';
import { useFetchingErrorModal } from '@/store/fetchingModalStore';
import { useBookingStore } from '@/store/bookingStore';
import { usePaymentStore } from '@/store/paymentStore';

const route = useRoute();
const router = useRouter();
const formStore = useBookingForm();
const userStore = useUserStore();
const fetchingErrorModal = useFetchingErrorModal();
const bookingStore = useBookingStore();
const paymentStore = usePaymentStore();


const flight = ref<Flight | undefined>(undefined);

// Fetch flight
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

// Fetch user payments
const {
  fetchData: fetchPayment,
  isLoading: isPaymentLoading
} = useFetching(async () => {
  await paymentStore.fetchPayment();
});

// Fetch discount code
const {
  fetchData: validateDiscount,
  isLoading: isLoadingDiscount
} = useFetching(async () => {
  try {
    const d = await DiscountService.validateCode(formStore.code);
    formStore.discount = d;
  } catch (err) {
    fetchingErrorModal.visible = true;
    fetchingErrorModal.title = 'Не валидный промо-код';
    fetchingErrorModal.contents = 'Вы ввели неверный промо-код!';
    formStore.code = "";
  }
});

// Fetch discount rules
const {
  fetchData: fetchDiscountRules,
  isLoading: isLoadingRules
} = useFetching(async () => {
  await userStore.fetchRules();
});

onMounted(async () => {
  formStore.baggageWeight = parseInt(route.query.bw as string) || 0;
  formStore.flightId = flightId;
  await userStore.fetchUser();
  fetchFlight();
  fetchPayment();
  fetchDiscountRules();
});

onScopeDispose(() => {
  formStore.clear();
})

const baseCost = computed<number>(() => {
  if (!flight.value)
    return 0;
  return flight.value?.price * formStore.seats;
})

const baggagePrice = computed<number>(() => {
  if (!flight.value)
    return 0;
  const mfw = flight.value.company.baggage_rule?.max_free_weight || 0;
  const kg = flight.value.company.baggage_rule?.price_per_kg || 0;
  return formStore.baggageWeight > mfw ? (formStore.baggageWeight - mfw) * kg : 0;
});

const discountAmount = computed<number>(() => {
  if (!formStore.discount)
    return 0;

  return formStore.discount.amount;
});

const levelDiscount = computed<number>(() => {
  if (!userStore.user || !userStore.rules)
    return 0;
  return userStore.rules[userStore.user.level].discount;
});

const totalCost = computed<number>(() => {
  const tC = (baseCost.value + baggagePrice.value)
    * (1 - discountAmount.value - levelDiscount.value);
  return Math.ceil(tC);
});

const handleSubmit = async () => {
  if (formStore.paymentId === undefined
  && Object.keys(formStore.payment).length < 3) {
    fetchingErrorModal.visible = true;
    fetchingErrorModal.contents = 'Выберете способ оплаты или введите ваши платёжные данные'
    fetchingErrorModal.title = 'Не можем провести оплату';
    return;
  }

  const formData: CreateBookingPayload = {
    flight_id: flightId,
    baggage_weight: formStore.baggageWeight,
    payment_id: formStore.paymentId,
    payment: formStore.payment,
    seats: formStore.seats,
    code: formStore.code || undefined,
  }

  try {
    await bookingStore.add(formData);
    router.push({
      name: AuthRoutes.AccountPage.name,
      hash: AccountPageModes.Tickets
    });
    if (formStore.saveCard) {
      await paymentStore.addPayment(formStore.payment);
    }
  } catch {
  }
};

const validateCode = async () => {
  await validateDiscount();
}

</script>

<template>
  <div class="container" v-if="flight !== undefined">
    <!-- Title -->
    <h1 class="text-center fw-bold mb-5 mt-3">
      Давайте купим билет
    </h1>

    <div class="glass glass-border section-base">

      <div class="section-link">
        <GlassLink @click="$router.go(-1)">
          Назад
        </GlassLink>
      </div>

      <!-- Route Details -->
      <div
        class="glass glass-border light-shadow top-bar"
      >
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

        <!-- Baggage and Seats Controls -->
        <div class="top-bar-right flex-fill">
          <StepperInput
            v-model:value="formStore.baggageWeight"
            placeholder="Укажите число"
            :min="0"
            :max="40"
          >
            Багаж
          </StepperInput>
          <StepperInput
            v-model:value="formStore.seats"
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

          <!-- Payment -->
          <BookingPaymentForm
            v-if="!isPaymentLoading"
            :payments="paymentStore.payments"
          />

          <!-- Promo Code -->
          <div>
            <h3>
              Промокод
            </h3>
            <div class="d-flex gap-3 mt-3">
              <GlassInput
                type="text"
                class="small w-75"
                placeholder="Промокод"
                v-model:value="formStore.code"
              />
              <GlassButtonSmall
                class="fs-5"
                @click="validateCode"
                :disabled="isLoadingDiscount || formStore.discount !== undefined"
              >
                {{formStore.discount === undefined ? 'Применить' : 'Применён'}}
              </GlassButtonSmall>
            </div>
          </div>

        </div>

        <!-- Total Cost -->
        <div class="glass glass-border light-shadow bottom-bar-right">
          <BookingTotalCost 
            v-if="!isLoadingRules && flight"
            :flight="flight"
            :seats="formStore.seats"
            :levelDiscount="levelDiscount"
            :baseCost="baseCost"
            :codeDiscount="discountAmount"
            :baggagePrice="baggagePrice"
            :userLevel="userStore.user?.level || UserLevel.Basic"
            :totalCost="totalCost"
          />

          <GlowButton class="w-100" @click="handleSubmit">
            Приобрести
          </GlowButton>
        </div>
        
      </div>
    </div>
  </div>
</template>

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