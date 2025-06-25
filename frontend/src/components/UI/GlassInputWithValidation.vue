<script setup lang="ts">
import GlassInput from '@/components/UI/GlassInput.vue';

defineProps({
  error: {
    type: String,
    default: null,
  },
  className: {
    type: String,
    default: ''
  }
});

</script>

<template>
  <div :class="className">
    <GlassInput v-bind="$attrs" />
    <div class="invalid-feedback m-0" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped></style>