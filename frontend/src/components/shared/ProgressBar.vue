<template>
  <div class="glass w-100 progress-bar" v-bind="$attrs">
    <div
      class="progress-bar-fill"
      :style="style"
    >

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  progress: number,
}>();

const style = computed<string>(() => {
  return `width: ${props.progress}%`;
});

</script>

<style scoped>
.progress-bar {
  position: relative;
  padding: 1rem;
  border: solid 1px var(--accent-2);
  border-radius: 10px;
  box-shadow: inset 0 -10px 30px #ffc40071;
}
.progress-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(-20deg, var(--accent-1) -20%, var(--accent-2) 100%);
  z-index: 2;
  box-shadow: 0px 4px 30px var(--accent-2),
    inset 0 -10px 30px rgba(255, 255, 255, 0.4);
}
</style>