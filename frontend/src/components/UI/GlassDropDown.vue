<template>
  <ul
    class="glass glass-border glass-dropdown-list"
    v-if="visible"
  >
    <div
      v-for="(option, optionIndex) in options"
      :key="option.value"
    >
      <li
        class="glass-dropdown-element"
        :class="resolveOptCls(option, optionIndex)"
        @click="() => option.selectable ? handleSelect(option) : ('')"
        :disabled="(!option.selectable)"
      >
        <img
          v-if="option.icon"
          :src="option.icon"
          class="sm-icon option"
          alt="map-pin"
        >
        {{ option.title }}
      </li>
      <li
        v-if="option.suboptions"
        class="glass-dropdown-element glass-dropdown-subelement"
        v-for="(suboption, suboptionIndex) in option.suboptions"
        :class="resolveSubOptCls(suboption, optionIndex, suboptionIndex, option.suboptions.length)"
        :key="suboption.value"
        @click="() => suboption.selectable ? handleSelect(suboption) : ('')"
        :disabled="(!suboption.selectable)"
      >
        <img
          v-if="suboption.icon"
          :src="suboption.icon"
          class="sm-icon option"
          alt="airport"
        >
        {{ suboption.title }}
      </li>
    </div>
  </ul>
</template>

<script setup lang="ts">
import type { Option } from '@/types/ui/option';
import { onBeforeUnmount, onMounted } from 'vue';

const props = defineProps<{
  visible: boolean;
  options: Option[];
  root: HTMLElement | undefined;
  onSelect: (option: Option) => void;
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>();

const handleSelect = (option: Option) => {
  emit('update:visible', false);
  props.onSelect(option);
};

const resolveOptCls = (option: Option, index: number) => {
  const prefix = option.classes ?? '';
  if (index == 0)
    return prefix + ' first';
  else if (index == props.options.length - 1)
    return prefix + ' last'
  else
    return prefix;
};

const resolveSubOptCls = (
  option: Option, index: number, subIndex: number, subLen: number
) => {
  const prefix = option.classes ?? '';
  if (subIndex === subLen - 1 && index === props.options.length - 1)
    return prefix + ' last';
  else
    return prefix;
};

const handleClickOutside = (event: MouseEvent) => {
  if (props.root !== undefined ) {
    if (
      !props.root.contains(event.target as Node)
      && props.visible
    ) {
      console.log("clicked outside");
      emit('update:visible', false);
    }
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

</script>

<style scoped>

</style>