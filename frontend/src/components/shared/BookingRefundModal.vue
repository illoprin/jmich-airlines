<template>
  <ModalBase v-model:visible="bookingRefundModal.visible">
    <template v-slot:title>
      {{ header }}
    </template>

    <template v-slot:contents>
      <div v-if="bookingRefundModal.type === BookingRefundTypes.Cancel">
        <p class="fs-5">Вы действительно хотите отменить бронирование?</p>
        <div class="d-flex gap-3 w-100">

          <GlassButtonSmall class="flex-fill" @click="() => bookingRefundModal.visible = false">
            Нет
          </GlassButtonSmall>
          <GlassButtonSmall class="flex-fill" @click="handleCancel">
            Да
          </GlassButtonSmall>
        </div>
      </div>

      <div v-if="bookingRefundModal.type === BookingRefundTypes.Refund">
        <p class="fs-5">Запрос принят! Деньги будут возвращены вам на карту в течение 24 часов.</p>
      </div>
    </template>

  </ModalBase>
</template>

<script setup lang="ts">
import GlassButtonSmall from '@/components/UI/GlassButtonSmall.vue';
import ModalBase from '@/components/UI/ModalBase.vue';
import { useBookingRefundStore } from '@/store/bookingRefundStore';
import { useBookingStore } from '@/store/bookingStore';
import { BookingRefundTypes } from '@/types/sort/bookingRefundTypes';
import { computed } from 'vue';

const bookingRefundModal = useBookingRefundStore();
const bookingStore = useBookingStore();

const header = computed<string>(() => {
  switch (bookingRefundModal.type) {
    case BookingRefundTypes.Cancel:
      return "Отмена бронирования"
    case BookingRefundTypes.Refund:
      return "Возврат средств"
  }
  return ""
});

const handleCancel = async () => {
  await bookingRefundModal.cancel();
  await bookingStore.fetchUserBookings();
  bookingRefundModal.visible = false;
}

</script>

<style scoped></style>