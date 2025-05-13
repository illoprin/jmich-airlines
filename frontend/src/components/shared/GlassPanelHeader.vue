<script setup lang="ts">
defineProps({
  align: { type: String, reqired: false, default: 'start' }
});
</script>

<template>
  <div :class="`text-${align}`">
    <h4 class="fw-bold mb-2">
      <slot name="header"/>
    </h4>
    <p class="text-white-50">
      <slot name="subheader"/>
    </p>
  </div>
</template>