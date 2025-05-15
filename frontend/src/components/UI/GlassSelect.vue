<script setup lang="ts">
import type { DefaultOption } from "@/types/ui/fancyRadio";
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps<{
  options: DefaultOption[],
  onSelect: (selected: DefaultOption) => void,
}>();

const selectedOption = ref<DefaultOption | null>(null);

const isOpen = ref<boolean>(false);

// needs to check click target
const dropdownRef = ref<HTMLElement | null>(null);

function handleSelect(selected: DefaultOption) {
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
      class="w-100 form-glass glass small text-start"
      @click="() => isOpen = !isOpen"
    >
      <slot v-if="!selectedOption" />
      <span v-else>{{ selectedOption.label }}</span>
    </button>

    <ul
      class="glass glass-border glass-panel glass-dropdown-list"
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
        {{ option.label }}
      </li>
    </ul>

  </div>
</template>

<style scoped>

</style>