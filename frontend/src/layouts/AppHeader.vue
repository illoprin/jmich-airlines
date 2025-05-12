<script setup lang="ts">
import { RouterLink } from "vue-router";
import { GUEST_ROUTES } from "@/router/routes.ts";
import JmichLogoWide from '@/assets/icons/jmich-logo-wide.svg';

</script>

<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <img :src="JmichLogoWide" alt="Jmich.Airlines logo">
    <RouterLink
      :to="GUEST_ROUTES.AUTHORIZATION_PAGE"
      class="auth-link"
    >
      Авторизация
    </RouterLink>
  </div>
</template>

<style scoped>
.auth-link {
  font-size: 1rem;
  color: white;
  text-decoration: none;
}
</style>