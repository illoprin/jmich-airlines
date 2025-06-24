<template>
  <div class="glass-convex glass-border glass-padding d-flex flex-column gap-3">
    
    <RouterLink
      :to="GuestRoutes.Search.path"
      class="text-white fw-bold fs-3 text-center w-100 p-5"
      v-if="likedFlightStore.liked.length === 0"
    >
      Искать билеты
    </RouterLink>

    <LikedFlightItem
      v-for="liked in likedFlightStore.liked"
      :key="liked.id"
      :flight="liked"
    />

  </div>

</template>

<script setup lang="ts">
import LikedFlightItem from '@/components/shared/LikedFlightItem.vue';
import { GuestRoutes } from '@/router/routes';
import { useLikedStore } from '@/store/likedFlightsStore';


const likedFlightStore = useLikedStore();


</script>