<script setup lang="ts">
import AppHeader from "@/layouts/AppHeader.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { AuthRoutes, GuestRoutes, NotFoundRoute } from "@/router/routes.ts";
import AppFooter from "@/layouts/AppFooter.vue";

const route = useRoute();

const isAuthPage = computed<boolean>(() =>
  route.fullPath.includes(GuestRoutes.Authorization.path)
);

const isNotFoundPage = computed<boolean>(() => 
  route.fullPath.includes(NotFoundRoute.path)
);

const isBookingPage = computed<boolean>(() => 
  route.fullPath.includes(AuthRoutes.BookingPage.name)
);

</script>

<template>
  <div
    class="container-lg m-auto"
    v-if="!isAuthPage && !isNotFoundPage"
  >
    <AppHeader />
  </div>
  <RouterView />
  <AppFooter
    v-if="!isAuthPage && !isNotFoundPage && !isBookingPage"
  />
</template>