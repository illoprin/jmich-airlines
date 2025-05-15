<template>
  <div class="w-auto d-flex gap-3" v-bind="$attrs">
    <div class="glass form-checkbox w-auto" @click="handleClick">
      <img :src="CheckIco" alt="check-ico" class="md-sm-icon" v-if="checked">
    </div>
    <span class="fs-5">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
import CheckIco from '@/assets/icons/check.svg'

const props = defineProps<{
  checked: boolean;
}>();

const emit = defineEmits<{
  (e: "update:checked", value: boolean): void
}>();

const handleClick = () => {
  emit("update:checked", !props.checked);
}

</script>