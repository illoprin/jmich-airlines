<template>
  <div class="container auth-panel" :class="mode === AuthorizationPageModes.Registration ? 'mode-reg' : 'mode-auth'">
    <JmichLogo />
    <div class="panel-tabs">

      <div class="tab-bar">
        <button class="glass tab-button" @click="switchToReg"
          :class="mode === AuthorizationPageModes.Registration ? 'active' : ''">
          Регистрация
        </button>
        <button class="glass tab-button" @click="switchToAuth"
          :class="mode === AuthorizationPageModes.Authorization ? 'active' : ''">
          Авторизация
        </button>
      </div>


      <div class="glass glass-border glass-panel w-100 text-center">

        <LoginForm v-model:form="loginForm" :errors="loginErrors"
          v-if="mode === AuthorizationPageModes.Authorization" />

        <RegistrationForm v-model:form="regForm" :errors="regErrors" v-else />

        <div class="d-flex justify-content-between mt-5 gap-3">
          <GlassButtonSmall @click="$router.push({ name: GuestRoutes.Search.name })">
            На главную
          </GlassButtonSmall>
          <GlassButtonSmall @click="handleSubmit">
            {{ mode == AuthorizationPageModes.Authorization ? 'Войти' : 'Зарегистрироваться' }}
          </GlassButtonSmall>
        </div>

      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AuthorizationPageModes } from "@/types/hash/authorization";
import LoginForm from "@/components/views/authorization/LoginForm.vue";
import RegistrationForm from "@/components/views/authorization/RegistrationForm.vue";
import JmichLogo from "@/components/UI/JmichLogo.vue";
import type { UserLoginPayload, UserRegistrationPayload } from "@/api/types/requests/user";
import GlassButtonSmall from "@/components/UI/GlassButtonSmall.vue";
import { GuestRoutes } from "@/router/routes";
import { useValidation, type ValidationSchema } from "@/composable/useValidation";
import { emailRegex, generalLatinRegex, oneUnicodeWordRegex, phoneRegex } from "@/utils/regex";

const route = useRoute();
const router = useRouter();

const mode = computed<string>(() => {
  const hash = route.hash || AuthorizationPageModes.Registration;
  return hash;
});

const loginSchema: ValidationSchema<UserLoginPayload> = {
  login: {
    required: true,
    minLength: 3,
    maxLength: 255,
    match: generalLatinRegex,
    message: "Логин не может содержать спецсимволы кроме -_&$"
  },
  password: {
    required: true,
    minLength: 3,
    maxLength: 255,
    match: generalLatinRegex,
    message: "Пароль не может содержать спецсимволы кроме -_&$"
  },
};
const loginForm = ref<UserLoginPayload>({} as any);
const {
  errors: loginErrors,
  validate: validateLogin
} = useValidation<UserLoginPayload>(loginSchema);

const regSchema: ValidationSchema<UserRegistrationPayload> = {
  ...loginSchema,
  email: {
    required: true,
    maxLength: 255,
    match: emailRegex,
    message: "Введите корректный email"
  },
  phone: {
    required: true,
    match: phoneRegex,
    message: "Номер телефона - 10 цифр без (+7)"
  },
  firstname: {
    required: true,
    minLength: 4,
    match: oneUnicodeWordRegex,
    message: "Введите ваше имя на русском или английском языке"
  },
  secondname: {
    required: true,
    minLength: 4,
    match: oneUnicodeWordRegex,
    message: "Введите вашу фамилию на русском или английском языке"
  }
}
const regForm = ref<UserRegistrationPayload>({} as any);
const {
  errors: regErrors,
  validate: validateReg
} = useValidation<UserRegistrationPayload>(regSchema);

const submitLoginForm = () => {
  if (!validateLogin(loginForm.value)) {
    return;
  }
  console.log(loginForm.value);
}

const submitRegForm = () => {
  if (!validateReg(regForm.value)) {
    return;
  }
  console.log(regForm.value);
}

const handleSubmit = () => {
  if (mode.value === AuthorizationPageModes.Authorization) {
    submitLoginForm();
  } else {
    submitRegForm();
  }
};

const switchToReg = () => {
  router.push(
    { name: GuestRoutes.Authorization.name, hash: AuthorizationPageModes.Registration }
  );
};

const switchToAuth = () => {
  router.push(
    { name: GuestRoutes.Authorization.name, hash: AuthorizationPageModes.Authorization }
  );
}
</script>

<style scoped>
@media screen and (max-width: 1080px) {
  .auth-panel {
    width: 100% !important;
    flex-flow: column nowrap !important;
    gap: 2rem !important;
  }
}

.auth-panel {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40%;
  transition: flex-direcrion 300ms, gap 300ms, width 300ms;
  will-change: flex-direction, gap, width;
}

.auth-panel.mode-auth {
  flex-flow: column nowrap;
  gap: 2rem;
}

.auth-panel.mode-reg {
  width: 70%;
  flex-flow: row nowrap;
  gap: 10rem;
}
</style>
