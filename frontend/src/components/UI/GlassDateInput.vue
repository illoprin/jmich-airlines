<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  min: { required: false, type: Date, default: new Date(0) },
  max: { required: false, type: Date, default: new Date(Number.MAX_SAFE_INTEGER) },
});

const emits = defineEmits<{
  (e: 'update:input', value: string): void
}>();

const datepickerRef = ref<HTMLInputElement | undefined>(undefined);
const selectedDate = ref<string>("");
const invalidDate = ref<boolean>(false);

function showCalendar() {
  if (datepickerRef.value) {    
    datepickerRef.value.showPicker();
  }
}

function onSelect() {
  if (datepickerRef.value) {
    const val = new Date(datepickerRef.value.value);
    if (val > props.max || val < props.min) {
      invalidDate.value = true;
      return;
    }
    invalidDate.value = false;
    emits('update:input', datepickerRef.value.value);
    selectedDate.value = datepickerRef.value.value;
  }
}

</script>

<template>
  <button 
    class="glass glass-border form-glass"
    style="text-align: left;"
    v-bind="$attrs"
    @click="showCalendar"
  >
    <input
      type="date"
      class="input-invisible"
      ref="datepickerRef"
      @change="onSelect"
      :min="min.toLocaleDateString()"
      :max="max.toLocaleDateString()"
    />
    <span class="text-white-50" v-if="!selectedDate && !invalidDate">
      Выберете дату
    </span>
    {{ selectedDate && !invalidDate ? selectedDate : '' }}
    <span v-if="invalidDate" style="color: var(--red-accent-1);">
      Некорректная дата
    </span>

  </button>
</template>

<style scoped>
.input-invisible {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

input[type=date]::-webkit-datetime-edit-text {
    -webkit-appearance: none;
    display: none;
}
input[type=date]::-webkit-datetime-edit-month-field{
    -webkit-appearance: none;
    display: none;
}
input[type=date]::-webkit-datetime-edit-day-field {
    -webkit-appearance: none;
    display: none;
}
input[type=date]::-webkit-datetime-edit-year-field {
    -webkit-appearance: none;
    display: none;
}


</style>