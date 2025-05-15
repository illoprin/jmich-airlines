<script setup lang="ts">
import type { DefaultOption } from '@/types/ui/fancyRadio';
import { ref, computed, onMounted, watch, nextTick } from 'vue';

const props = defineProps<{
  options: DefaultOption[];
  value: string | number;
}>();

const emit = defineEmits<{
  (e: 'update:value', value: string | number): void;
}>();

const containerRef = ref<HTMLElement | null>(null);
const highlightRef = ref<HTMLElement | null>(null);

const selectedIndex = computed(() =>
  props.options.findIndex(o => o.value === props.value)
);

const updateHighlight = () => {
  if (!containerRef.value || !highlightRef.value) return;
  console.log("highlight update hook");
  const buttons = containerRef.value.querySelectorAll('.option-button');
  const selected = buttons[selectedIndex.value] as HTMLElement;

  if (selected) {
    const { offsetTop, offsetHeight } = selected;
    highlightRef.value.style.transform = `translateY(${offsetTop}px)`;
    highlightRef.value.style.height = `${offsetHeight}px`;
  }
};

const handleClick = (option: DefaultOption) => {
  console.log(option.value);
  emit('update:value', option.value)
}

watch(() => props.value, async () => {
  await nextTick();
  updateHighlight();
});

onMounted(() => {
  updateHighlight();
});
</script>

<template>
  <div
    class="glass radio-container glass-border vertical"
    ref="containerRef"
    v-bind="$attrs"
  >
    <div class="glass-button radio-highlight horizontal" ref="highlightRef" />
    <button
      v-for="option in options"
      :key="option.value"
      class="option-button"
      :class="{ active: option.value === value }"
      @click="handleClick(option)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.option-button.active {
}


</style>
