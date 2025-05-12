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

</style>