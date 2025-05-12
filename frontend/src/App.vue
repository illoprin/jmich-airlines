<script setup lang="ts">
import AppHeader from "@/layouts/AppHeader.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { GUEST_ROUTES } from "@/router/routes.ts";

const route = useRoute();

const isAuth = computed<boolean>(() =>
  route.fullPath.includes(GUEST_ROUTES.AUTHORIZATION_PAGE)
);

</script>

<template>
  <div class="container p-4">
    <AppHeader v-if="!isAuth" />
    <RouterView />
  </div>
</template>

<style scoped></style>
