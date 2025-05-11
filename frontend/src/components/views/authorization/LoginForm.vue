<script setup lang="ts">

import { AuthorizationPageModes, GUEST_ROUTES } from "@/router/routes.ts";
</script>

<template>
  <h2>
    Login
  </h2>
  <RouterLink
      :to="{ path: GUEST_ROUTES.AUTHORIZATION_PAGE, hash: AuthorizationPageModes.Registration}"
  >
    Registration
  </RouterLink>

</template>

<style scoped>

</style>