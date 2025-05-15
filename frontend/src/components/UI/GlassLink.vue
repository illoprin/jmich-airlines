<template>
  <span class="glass-link" v-bind="$attrs">
    <img :src="ArrowLeftIco" alt="arrow-left" class="small-icon">
    <slot />
  </span>
</template>

<script setup lang="ts">
import ArrowLeftIco from '@/assets/icons/arrow-left.svg';

</script>

<style scoped>
.small-icon {
  width: 1rem;
  margin-right: 1rem;
}
.glass-link {
  display: flex;
  text-decoration: underline;
  font-weight: 700;
  cursor: pointer;
}

</style>