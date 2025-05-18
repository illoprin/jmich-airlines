<template>
  <div class="glass glass-border flex-fill fs-5 p-3 d-flex gap-3 justify-content-center align-items-center">
    <img :src="MailIco" alt="mail-ico" class="sm-md-icon">
    {{ userStore.user?.email }}
  </div>
  <div class="glass glass-border flex-fill fs-5 p-3 d-flex gap-3 justify-content-center align-items-center">
    <img :src="PhoneIco" alt="phone-ico" class="sm-md-icon">
    {{ formatString(userStore.user?.phone || "", "+7 (xxx) xxx xx-xx") }}
  </div>
  <div class="glass glass-border flex-fill fs-5 p-3 d-flex gap-3 justify-content-center align-items-center">
    <img :src="PaymentIco" alt="payment-ico" class="sm-md-icon">
    {{ cardLabel }}
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import MailIco from '@/assets/icons/mail.svg'
import PhoneIco from '@/assets/icons/phone.svg'
import PaymentIco from '@/assets/icons/credit-card.svg'
import { formatString } from '@/lib/format/format';
import { usePaymentStore } from '@/store/paymentStore';
import { computed } from 'vue';

const userStore = useUserStore();
const paymentStore = usePaymentStore();

const cardLabel = computed<string>(() => {
  if (!paymentStore.payments)
    return 'Не удалось загрузить';

  if (paymentStore.payments.length === 0)
    return 'Привяжите карту';
  
  const count = paymentStore.payments?.length;
  let labelCard = '';
  if (count === 1)
    labelCard = 'карта';
  else if (count >= 2 && count < 5)
    labelCard = 'карты';
  else
    labelCard = 'карт';

  return `Привязано ${count} ${labelCard}`;
});
</script>

<style scoped></style>