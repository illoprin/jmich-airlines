<script setup lang="ts">

import { AuthorizationPageModes, GUEST_ROUTES } from "@/router/routes.ts";

</script>

<template>
  <h2>
    Registration
  </h2>
  <RouterLink
    :to="{ path: GUEST_ROUTES.AUTHORIZATION_PAGE, hash: AuthorizationPageModes.Authorization}"
  >
    Login
  </RouterLink>
</template>

<style scoped>

</style>