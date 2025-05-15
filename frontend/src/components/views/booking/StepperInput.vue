<template>
  <div>
    <span class="fs-4 text-white-50 mb-2">
      <slot />
    </span>
    <div class="d-flex gap-3">
      <GlassButtonSmall class="solo" @click="handleClick(-1)">
        <img :src="ArrowDownIco" class="sm-md-icon" alt="arrow-down">
      </GlassButtonSmall>
      <GlassInput class="small text-center" v-bind="$attrs" :value="String(value) === '0' ? '' : String(value)" disabled/>
      <GlassButtonSmall class="solo" @click="handleClick(1)">
        <img :src="ArrowUpIco" class="sm-md-icon" alt="arrow-up">
      </GlassButtonSmall>
    </div>
  </div>
</template>
<script setup lang="ts">
import ArrowDownIco from '@/assets/icons/arrow-down.svg'
import ArrowUpIco from '@/assets/icons/arrow-up.svg'
import GlassButtonSmall from '@/components/UI/GlassButtonSmall.vue';
import GlassInput from '@/components/UI/GlassInput.vue';

const props = defineProps<{
  value: number;
  min: number;
  max: number;
}>();

const emit = defineEmits<{
  (e: "update:value", value: number): void,
}>();

const handleClick = (delta: number) => {
  if (props.value + delta >= props.min && props.value + delta <= props.max) {
    emit('update:value', props.value + delta);
  }
  return;
};
</script>