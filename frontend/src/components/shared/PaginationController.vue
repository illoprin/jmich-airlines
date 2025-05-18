<template>
  <div class="d-flex justify-content-between align-items-center">
    <img
      :src="ChevronLeft"
      alt="chevron-left"
      class="btn-icon sm-md-icon"
      style="margin-right: 1rem;"
      @click="deltaPage(-1)"
    >
    <span
      class="fs-5"
    >
      Страница {{ page + 1 }}
    </span>
    <img
      :src="ChevronRight"
      alt="chevron-right"
      class="btn-icon sm-md-icon"
      style="margin-left: 1rem;"
      @click="deltaPage(1)"
    >
  </div>
</template>

<script setup lang="ts">
import ChevronLeft from '@/assets/icons/chevron-left.svg'
import ChevronRight from '@/assets/icons/chevron-right.svg'


const props = defineProps<{
  page: number
  callback?: () => any
}>();

const emit = defineEmits<{
  (e: "update:page", value: number): void
}>();

const deltaPage = (delta: number) => {
  if (props.page + delta < 0) return;
  emit('update:page', props.page + delta);
  if (props.callback)
    props.callback();
}

</script>

<style scoped>

</style>