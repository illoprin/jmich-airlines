<script setup lang="ts">

import { GUEST_ROUTES } from '@/router/routes';
import { AuthorizationPageModes } from "@/types/hash/authorization.ts";


</script>

<template>
  <h2>
    Registration
  </h2>
  <RouterLink
    :to="{
      path: GUEST_ROUTES.AUTHORIZATION_PAGE,
      hash: '#' + AuthorizationPageModes.Authorization
    }"
  >
    Login
  </RouterLink>
</template>

<style scoped>

</style>