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
    const { offsetLeft, offsetWidth } = selected;
    highlightRef.value.style.transform = `translateX(${offsetLeft}px)`;
    highlightRef.value.style.width = `${offsetWidth}px`;
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
    class="glass radio-container glass-border"
    ref="containerRef"
    v-bind="$attrs"
  >
    <div class="glass-button radio-highlight vertical" ref="highlightRef" />
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

.option-button {
  position: relative;
  flex: 1;
  padding: 10px 16px;
  background: transparent;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;
  z-index: 1;
  transition: color 0.2s ease;
}

.option-button.active {
}

.highlight {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 16px;
  background: linear-gradient(180deg, #f6c44b, #ef9e43);
  box-shadow: 0px 4px 24px rgba(255, 182, 0, 0.4);
  z-index: 0;
  transition: transform 0.3s, width 0.3s;
}
</style>
