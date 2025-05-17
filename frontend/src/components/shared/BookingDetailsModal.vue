<template>

  <ModalBase
    v-model:visible="bookingModalStore.visible"
  >

    <template v-slot:title>
      <span v-if="bookingModalStore.booking">
        Заказ от {{ new Date(bookingModalStore.booking.created as any).toLocaleDateString() }}
      </span>
    </template>

    <template v-slot:contents>
      <div class="w-100 d-flex flex-column align-items-center" v-if="bookingModalStore.booking">
        <h2 class="fs-5 fw-bold">Просто покажите QR-код на стойке регистрации</h2>
        <img :src="`${bookingModalStore.booking.qr_code}`" alt="booking-qr" class="rounded-3 shadow">
        <div class="row mt-4">

          <div class="col-md-6">
            <span class="fs-4 text-white-50 lh-1">
              Номер рейса
            </span>
            <span class="fs-3 fw-bold">
              {{ bookingModalStore.booking.flight.route_code }}
            </span>
          </div>

          <div class="col-md-6 text-end">
            <span class="fs-4 text-white-50 lh-1">
              Вес багажа
            </span>
            <span class="fs-3 fw-bold">
              {{ bookingModalStore.booking.baggage_weight }} кг
            </span>
          </div>

          <div class="col-md-6">
            <span class="fs-4 text-white-50 lh-1">
              Выход на посадку
            </span>
            <span class="fs-3 fw-bold">
              G02
            </span>
          </div>

          <div class="col-md-6 text-end">
            <span class="fs-4 text-white-50 lh-1">
              Стоимость
            </span>
            <span class="fs-3 fw-bold">
              {{ formatPrice(bookingModalStore.booking.cost, "₽") }}
            </span>
          </div>
          
          

        </div>
      </div>
    </template>

  </ModalBase>

</template>

<script setup lang="ts">
import ModalBase from '@/components/UI/ModalBase.vue';
import { formatPrice } from '@/lib/format/formatPrice';
import { useBookingModalStore } from '@/store/bookingModalStore';

const bookingModalStore = useBookingModalStore();
</script>