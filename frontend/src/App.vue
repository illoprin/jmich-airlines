<script setup lang="ts">
import AppHeader from "@/layouts/AppHeader.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { GuestRoutes, NotFoundRoute } from "@/router/routes.ts";
import AppFooter from "@/layouts/AppFooter.vue";

const route = useRoute();

const isAuth = computed<boolean>(() =>
  route.fullPath.includes(GuestRoutes.Authorization.path)
);

const isNotFound = computed<boolean>(() => 
  route.fullPath.includes(NotFoundRoute.path)
);

</script>

<template>
  <div class="container-lg m-auto">
    <AppHeader v-if="!isAuth && !isNotFound" />
  </div>
  <RouterView />
  <AppFooter v-if="!isAuth && !isNotFound"/>
</template>

<style scoped></style>
