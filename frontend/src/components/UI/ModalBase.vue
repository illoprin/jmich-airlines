<template>
  <div
    class="modal-root"
    @click="handleClose"
    :class="cls"
  >
    
    <div
      class="modal-dialogue glass-convex glass-border"
      :class="cls"
      v-bind="$attrs"
      @click="(e) => e.stopPropagation()"
    >
      
      <div class="modal-header p-3">
        <div class="fs-5 modal-header-title fw-bold">
          <slot name="title" />
        </div>
        <button type="button" class="btn-close" @click="handleClose"></button>
      </div>

      <div class="p-3">
        <slot name="contents" />
      </div>

    </div>
  
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';


const props = defineProps({
  needsCloseButton: {
    type: Boolean, default: false, required: false
  },
  visible: {
    type: Boolean, required: true
  }
});

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>();

const cls = computed<string>(() => {
  if (props.visible) {
    document.body.style.overflowY = 'hidden';
    return 'active';
  }
  document.body.style.overflowY = 'scroll';
  return '';
});

const handleClose = () => {
  console.log("close modal");
  emit('update:visible', false);
}

</script>

<style scoped>
@media screen and (max-width: 900px) {
  .modal-dialogue {
    width: 100%;
    border-radius: 0 !important;
  }
}

.modal-root {
  display: block;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 2;

  pointer-events: none;
  opacity: 0.0;
  background-color: var(--glass-panel-shadow);
  backdrop-filter: blur(0px);

  transition: opacity 300ms, backdrop-filter;

  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-root.active {
  backdrop-filter: blur(10px);
  opacity: 1;
  pointer-events: painted;
}

.modal-dialogue {

  transform: scale(0.7);
  opacity: 0.3;
  transition: 300ms transform, 200ms opacity;
  will-change: transform;
}

.modal-dialogue.active {
  transform: scale(1.0);
  opacity: 1;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: solid 2px var(--glass-stroke-light);
}

.modal-header div {
  margin-right: 4.5rem;
}
</style>