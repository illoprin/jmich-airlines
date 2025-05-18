<template>
  <ModalBase v-model:visible="fetchingError.visible">
    <template v-slot:title>
      {{ fetchingError.title }}
    </template>
    <template v-slot:contents>
      <div class="d-flex gap-3">        
        <img
          :src="AlertIco"
          alt="alert"
          class="lg-icon"
        >
        <span class="fs-5">
          {{ fetchingError.contents }}
        </span>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from '@/components/UI/ModalBase.vue';
import { useFetchingErrorModal } from '@/store/fetchingModalStore';
import AlertIco from '@/assets/icons/alert.svg'


const fetchingError = useFetchingErrorModal();

</script>