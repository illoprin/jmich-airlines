<script setup lang="ts">
import AppHeader from "@/layouts/AppHeader.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { GuestRoutes } from "@/router/routes.ts";
import AppFooter from "@/layouts/AppFooter.vue";

const route = useRoute();

const isAuth = computed<boolean>(() =>
  route.fullPath.includes(GuestRoutes.Authorization.path)
);

</script>

<template>
  <AppHeader v-if="!isAuth" />
  <RouterView />
  <AppFooter v-if="!isAuth"/>
</template>

<style scoped></style>
