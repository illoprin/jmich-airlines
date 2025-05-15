<template>
  <div>
    <span class="fs-4">
      Ваш уровень: <strong>{{ userLevel }}</strong>
    </span>
  </div>
  <div class="tc-row">
    <span class="fs-5">
      Базовая цена
    </span>
    <span class="fs-3">
      {{ formatPrice(flight.price, "₽") }}x{{ seats }}
    </span>
  </div>


  <div v-if="baggagePrice">
    <div class="tc-row">
      <span class="fs-5">
        Стоимость багажа
      </span>
      <span class="fs-3">
        {{ formatPrice(baggagePrice, "₽") }}
      </span>
    </div>

  </div>
  

  <div class="tc-row">
    <span class="fs-5">
      Скидка по уровню
    </span>
    <span class="fs-3">
      {{ String(levelDiscount * 100) }}%
    </span>
  </div>


  <div v-if="codeDiscount">
    <div class="tc-row">
      <span class="fs-5">
        Скидка по промокоду
      </span>
      <span class="fs-3">
        {{ String(codeDiscount * 100) }}%
      </span>
    </div>
  </div>

  <div>
    <div class="tc-row last">
      <span class="fs-4">
        Итого
      </span>
      <span class="fs-3 badge-price">
        {{ formatPrice(totalCost, "₽") }}
      </span>
    </div>
  </div>


</template>

<script setup lang="ts">
import type { Flight } from '@/api/types/entities/flight';
import type { UserLevel } from '@/api/types/entities/user';
import { formatPrice } from '@/lib/format/formatPrice';

const props = defineProps<{
  levelDiscount: number;
  codeDiscount: number;
  baseCost: number;
  baggagePrice: number;
  totalCost: number;
  seats: number;
  flight: Flight;
  userLevel: UserLevel;
}>();

</script>

<style scoped>
.tc-row {
  padding: calc(var(--base-padding)*0.75) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: solid 2px var(--glass-stroke);
}

.tc-row.last {
  border: 0;
}

.badge-price {
  color: var(--bg-body-primary-1);
  font-weight: 500;
}
</style>