<template>
  <h3 class="mb-1">
    Ваш уровень -
    <strong>{{ userStore.user?.level }}</strong>
  </h3>
  <p class="text-white-50">
    {{ levelMessage }}
  </p>
  <ProgressBar
    :progress="levelProgress"
    class="mt-auto"
  />
  <div class="d-flex justify-content-between mt-2">
    <span class="progress-bar-value">
      {{ currentRuleCount }}
    </span>
    <span class="progress-bar-value">
      {{ (nextRuleCount - currentRuleCount) / 2}}
    </span>
    <span class="progress-bar-value">
      {{ nextRuleCount }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { UserLevel } from '@/api/types/entities/user';
import ProgressBar from '@/components/shared/ProgressBar.vue';
import { useBookingStore } from '@/store/bookingStore';
import { useUserStore } from '@/store/userStore';
import { computed } from 'vue';

const userStore = useUserStore();
const bookingStore = useBookingStore();

const levelMessage = computed<string>(() => {
  if (!userStore.user) {
    return '';
  }
  const user = userStore.user;

  switch (user.level) {
    case UserLevel.Basic:
      return `Вы экономите ${(userStore.getUserDiscount || 0) * 100}%. Повышайте свой уровень, чтобы получать скидки и выгодные предложения!`;
    case UserLevel.Silver:
      return `Ваша скидка на перелёты - ${(userStore.getUserDiscount || 0) * 100}%! Продолжайте пользоваться нашим сервисом, чтобы получать больше выгоды.`;
    case UserLevel.Gold:
      return `Поздравляем! С каждой покупкой вы сохраняете ${(userStore.getUserDiscount || 0) * 100}%.`; 
    case UserLevel.Premium:
      return `Это даёт вам ${(userStore.getUserDiscount || 0) * 100}% экономии на всех билетах. Вы на шаг ближе к максимальной выгоде!`; 
    case UserLevel.Platinum:
      return `Вы достигли наивысшего уровня, ваша скидка ${(userStore.getUserDiscount || 0) * 100} делает каждую поездку ещё выгоднее!`; 
  };
});

const currentRuleCount = computed<number>(() => {
  if (!userStore.rules || !userStore.user) {
    return 0;
  }
  return userStore.rules[userStore.user.level].requiredFlights;
});

const nextRuleCount = computed<number>(() => {
  if (!userStore.rules || !userStore.user) {
    return 0;
  }
  return userStore.getNextRule()?.requiredFlights || 0;
});

const levelProgress = computed<number>(() => {
  const cc = bookingStore.count || 0;
  const crc = currentRuleCount.value;
  const nrc = nextRuleCount.value;

  return ((cc - crc) / (nrc - crc)) * 100;
});

</script>

<style scoped>
.progress-bar-value {
  color: var(--accent-2)
}
</style>