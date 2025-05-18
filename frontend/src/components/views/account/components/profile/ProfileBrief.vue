<template>
  <div class="d-flex gap-5">
    <img
      :src="`${BASE_API}${userStore.user?.avatarpath}`"
      alt="user-avatar"
      class="rounded-circle user-avatar"
    >
    <div>
      <h2 class="fw-bold fs-4">
        {{ userStore.user?.firstname  }} {{ userStore.user?.secondname }}
      </h2>
      <h3 class="fs-5">
        {{ userStore.user?.login }}
      </h3>
    </div>
    <div class="profile-controls">
      <LogoutBtnIcon style="margin-right: 0.9rem;" @click="handleLogout"/>
      <TrashBtnIcon @click="handleRemove"/>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import LogoutBtnIcon from '@/components/icons/LogoutBtnIcon.vue';
import TrashBtnIcon from '@/components/icons/TrashBtnIcon.vue';
import { GuestRoutes } from '@/router/routes';
import { BASE_API } from '@/store/primaryStore';
import { useUserStore } from '@/store/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = async () => {
  await userStore.logout();
  router.push({ name: GuestRoutes.Authorization.name });
}

const handleRemove = async () => {
  await userStore.remove();
  router.push({ name: GuestRoutes.Authorization.name })
};

</script>

<style scoped>
.profile-controls {
  margin-left: auto;
}
</style>