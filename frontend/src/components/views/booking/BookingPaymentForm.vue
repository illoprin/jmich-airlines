<script setup lang="ts">
import MirIcon from '@/components/icons/MirIcon.vue';
import GlassCheckbox from '@/components/UI/GlassCheckbox.vue';
import GlassInput from '@/components/UI/GlassInput.vue';

</script>

<template>
  <div class="mb-3">
    <div class="d-flex justify-content-between">
      <h3>
        Оплата
      </h3>
      <div class="p-2">
        <MirIcon class="transparent-icon" />
      </div>
    </div>

    <div class="mt-3">
      <GlassInput type="text" class="small" placeholder="Номер карты" />
      <div class="d-flex gap-3 mt-3">
        <GlassInput type="text" class="small w-75" placeholder="Срок действия" />
        <GlassInput type="text" class="small w-25" placeholder="CVV" />
      </div>
    </div>

    <GlassCheckbox class="mt-3" v-model:checked="saveCard">
      Сохранить в профиле
    </GlassCheckbox>
  </div>
</template>

<script setup lang="ts">

</script>