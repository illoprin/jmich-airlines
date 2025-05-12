<script setup lang="ts">
import type { Option } from "@/types/ui/option.ts";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  options: Option[],
  onSelect: (selected: Option) => void,
}>();

const selectedOption = ref<Option | null>(null);

const isOpen = ref<boolean>(false);

// needs to check click target
const dropdownRef = ref<HTMLElement | null>(null);

function handleSelect(selected: Option) {
  selectedOption.value = selected;
  props.onSelect(selected);
  isOpen.value = false;
}

function handleClickOutside(event: MouseEvent) {
  if (isOpen.value) {
    if (
      dropdownRef.value &&
      !dropdownRef.value.contains(event.target as Node)
    ) {
      isOpen.value = false;
    }
  }
}

// Handle click outside - add event listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

// Handle click outside - remove event listener
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
});
</script>

<template>

  <div
    class="flex-fill"
    style="position: relative"
    ref="dropdownRef"
  >
    <button
      class="glass w-100 glass-border form-glass text-start"
      @click="() => isOpen = !isOpen"
    >
      <slot v-if="!selectedOption" />
      <span v-else>{{ selectedOption.title }}</span>
    </button>

    <ul
      class="glass glass-border glass-dropdown-list"
      v-if="isOpen"
    >
      <li
        v-for="(option, index) in options"
        :key="option.value"
        class="glass-dropdown-element"
        :class="index === options.length - 1 ? 'last' :
          index === 0 ? 'first' : '' "
        @click="handleSelect(option)"
      >
        {{ option.title }}
      </li>
    </ul>

  </div>
</template>

<style scoped>
.glass-dropdown-list {
  min-width: 100%;
  padding: 0;
  position: absolute;
  list-style: none;
  top: 120%;

  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
}

.glass-dropdown-element {
  padding: 0.4rem 1.5rem;
  transition: background-color 300ms,
  box-shadow 300ms;
  will-change: background-color, box-shadow;
  text-wrap: nowrap;

  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.glass-dropdown-element.first {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.glass-dropdown-element.last {
  border: 0;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.glass-dropdown-element:hover {
  background: linear-gradient(
    to top, transparent,
    rgba(255, 255, 255, 0.389)
  ),
  linear-gradient(-24deg, #c3891e, #F9ED40);

  box-shadow: inset -10px -10px 20px rgba(243, 244, 228, 0.389),
  10px 10px 30px rgba(182, 179, 17, 0.719),
  4px 5px 100px rgba(202, 193, 17, 0.234);

  cursor: pointer;
}
</style>