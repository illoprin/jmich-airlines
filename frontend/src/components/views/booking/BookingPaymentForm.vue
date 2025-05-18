<template>
  <div class="mb-3">
    <div class="d-flex justify-content-between">
      <h3>
        Оплата
      </h3>
      <div class="p-2">
        <MirIcon class="transparent-icon" />
      </div>
    </div>

    <div v-if="payments.length === 0">
      <div class="mt-3">
        <GlassInput
          type="text"
          class="small"
          placeholder="Номер карты"
          max="16"
          v-model:value="formStore.payment.number"
        />
        <div class="d-flex gap-3 mt-3">
          <GlassInput
            type="text"
            max="4"
            class="small w-75"
            placeholder="Срок действия"
            v-model:value="formStore.payment.expires"
          />
          <GlassInput
            type="text"
            max="3"
            class="small w-25"
            placeholder="CVV"
            v-model:value="formStore.payment.cvv"
          />
        </div>
      </div>
  
      <GlassCheckbox
        class="mt-3"
        v-model:checked="formStore.saveCard"
      >
        Сохранить в профиле
      </GlassCheckbox>
    </div>

    <div v-else-if="payments.length > 0">
      <GlassSelect
        :options="paymentsOptions"
        :onSelect="handleSelect"
      >
        Выберете банковскую карту
      </GlassSelect>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Payment } from '@/api/types/entities/payment';
import MirIcon from '@/components/icons/MirIcon.vue';
import GlassCheckbox from '@/components/UI/GlassCheckbox.vue';
import GlassInput from '@/components/UI/GlassInput.vue';
import GlassSelect from '@/components/UI/GlassSelect.vue';
import { useBookingForm } from '@/store/bookingFormStore';
import type { DefaultOption } from '@/types/ui/fancyRadio';
import { computed } from 'vue';

const formStore = useBookingForm();

const props = defineProps<{
  payments: Payment[]
}>();

const paymentsOptions = computed<DefaultOption[]>(() => {
  if (props.payments.length > 0) {
    const options: DefaultOption[] = [];
    props.payments.map(payment => {
      options.push({ label: payment.number, value: payment.id || 0 });
    });
    return options;
  }
  return [];
});

const handleSelect = (option: DefaultOption) => {
  formStore.paymentId = option.value as number;
};

</script>