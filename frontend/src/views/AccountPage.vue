<template>

  <div class="container">

    <h2 class="mb-3 mt-5 w-100 text-center fw-bold fs-3">
      {{ pageHeader }}
    </h2>

    <div class="panel-tabs mt-5">

      <div class="tab-bar">
        <button class="glass tab-button" v-for="tab in tabs" @click="tab.value !== AccountPageModes.Search
          ? $router.push({ hash: tab.value })
          : $router.push({ name: GuestRoutes.Search.name })" :class="mode === tab.value ? 'active' : ''">
          {{ tab.label }}
        </button>
      </div>

      <div v-if="!isLoading">
        <AccountProfile v-if="mode === AccountPageModes.Profile" />
        <AccountLiked v-else-if="mode === AccountPageModes.Liked" />
        <AccountTickets v-else-if="mode === AccountPageModes.Tickets" />
        <AccountSettings v-else-if="mode === AccountPageModes.Settings" />
      </div>
    </div>

  </div>

  <BookingDetailsModal />

</template>

<script setup lang="ts">
import { BookingStatus } from '@/api/types/entities/booking';
import { FlightStatus } from '@/api/types/entities/flight';
import BookingDetailsModal from '@/components/shared/BookingDetailsModal.vue';
import AccountLiked from '@/components/views/account/AccountLiked.vue';
import AccountProfile from '@/components/views/account/AccountProfile.vue';
import AccountSettings from '@/components/views/account/AccountSettings.vue';
import AccountTickets from '@/components/views/account/AccountTickets.vue';
import { useFetching } from '@/composable/useFetching';
import { GuestRoutes } from '@/router/routes';
import { useBookingStore } from '@/store/bookingStore';
import { usePaymentStore } from '@/store/paymentStore';
import { useUserStore } from '@/store/userStore';
import { AccountPageModes } from '@/types/hash/account';
import type { TabItem } from '@/types/ui/tab';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const mode = computed<AccountPageModes>(() => {
  const mode = route.hash;
  if (Object.values(AccountPageModes).includes(mode as any)) {
    return mode as AccountPageModes;
  } else {
    return AccountPageModes.Profile;
  }
});

const tabs: TabItem<AccountPageModes>[] = [
  {
    label: "Профиль",
    value: AccountPageModes.Profile
  },
  {
    label: "Понравившиеся",
    value: AccountPageModes.Liked
  },
  {
    label: "Мои билеты",
    value: AccountPageModes.Tickets
  },
  {
    label: "Поиск авиабилетов",
    value: AccountPageModes.Search
  },
  {
    label: "Настройки",
    value: AccountPageModes.Settings
  },
];

const paymentStore = usePaymentStore();
const userStore = useUserStore();
const bookingStore = useBookingStore();

const {
  fetchData: fetchData,
  isLoading
} = useFetching(async () => {
  await userStore.fetchUser();
  await userStore.fetchRules();
  await paymentStore.fetchPayment();
  await bookingStore.getCount();
  await bookingStore.fetchUserBookings();
});

const pageHeader = computed<string>(() => {
  if (!isLoading.value) {
    switch (mode.value) {
      case AccountPageModes.Profile:
        return `Добрый день, ${userStore.user?.firstname}`;

      case AccountPageModes.Liked:
        return `На X рейсов истекает срок регистрации`;

      case AccountPageModes.Tickets:
        if (bookingStore.bookings) {
          if (bookingStore.count > 0) {
            return `У вас ${bookingStore.count} активных билетов`
          } else if (bookingStore.bookings.length > 0 && bookingStore.count == 0) {
            return `Все перелёты завершены!`
          } else {
            return `Сделайте первый заказ!`
          }
        }
        return '';

      case AccountPageModes.Settings:
        return `Здесь вы можете настроить ваш аккаунт`;

      default:
        return "Личный кабинет";
    }
  }
  return '';
})

onMounted(() => {
  fetchData();
});

</script>

<style scoped>
@media screen and (max-width: 1080px) {
  .tab-bar {
    flex-flow: column;
  }
}


</style>