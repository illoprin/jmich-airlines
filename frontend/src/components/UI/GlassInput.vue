<script setup lang="ts">

const emit = defineEmits<{
  (e: 'update:value', value: string): void
}>();

const handleInput = (e: Event) => {
  emit('update:value', (e.target as HTMLInputElement).value)
}

</script>

<template>
  <input
    class="form-glass glass glass-border"
    @input="handleInput"
    v-bind="$attrs"
  />
</template>

<style scoped>
input[type="password"]::-ms-reveal {
  color-scheme: dark;
}
</style>