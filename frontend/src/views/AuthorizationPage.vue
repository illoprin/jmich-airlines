<script setup lang="ts">

import LoginForm from "@/components/views/authorization/LoginForm.vue";
import RegistrationForm from "@/components/views/authorization/RegistrationForm.vue";

import { computed } from "vue";
import { useRoute } from "vue-router";
import { AuthorizationPageModes } from "@/types/hash/authorization";

const route = useRoute();

const mode = computed<string>(() => {
  const hash = route.hash || AuthorizationPageModes.Registration;
  return hash.replace('#', '');
});

</script>

<template>
  <RegistrationForm v-if="mode === AuthorizationPageModes.Registration" />
  <LoginForm v-else />


</template>

<style scoped>

</style>
