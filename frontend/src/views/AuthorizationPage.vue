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

<template>
  <div class="container vh-100 auth-panel"
    :class="mode === AuthorizationPageModes.Registration ? 'mode-reg' : 'mode-auth'">
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


      <div class="glass glass-border glass-padding w-100 text-center">

        <strong class="fs-4 d-block mb-4">
          {{ title }}
        </strong>

        <LoginForm v-model:form="loginForm" :errors="loginErrors"
          v-if="mode === AuthorizationPageModes.Authorization || mode === AuthorizationPageModes.AuthAfterReg" />

        <RegistrationForm v-model:form="regForm" :errors="regErrors" v-else />

        <div class="d-flex justify-content-between mt-5 gap-3">
          <GlassButtonSmall @click="$router.push({ name: GuestRoutes.Search.name })">
            На главную
          </GlassButtonSmall>
          <GlassButtonSmall @click="handleSubmit">
            {{ buttonTitle }}
          </GlassButtonSmall>
        </div>

      </div>
    </div>
  </div>

  <ModalBase v-model:visible="authErrorModal">
    <template v-slot:title>
      Ошибка авторизации
    </template>
    <template v-slot:contents>
      <p>
        {{ authErrorMessage }}
      </p>
    </template>
  </ModalBase>

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
import { AuthRoutes, GuestRoutes } from "@/router/routes";
import { useValidation, type ValidationSchema } from "@/composable/useValidation";
import { emailRegex, generalLatinRegex, oneUnicodeWordRegex, phoneRegex } from "@/utils/regex";
import { AccountPageModes } from "@/types/hash/account";
import { useUserStore } from "@/store/userStore";
import ModalBase from "@/components/UI/ModalBase.vue";


const route = useRoute();
const router = useRouter();
const user = useUserStore();

const mode = computed<string>(() => {
  const hash = route.hash || AuthorizationPageModes.Registration;
  return hash;
});

const authErrorModal = ref<boolean>(false);
const authErrorMessage = ref<string>("");

const title = computed<string>(() => {
  switch (mode.value) {
    case AuthorizationPageModes.Registration:
      return 'Расскажите о себе';
    case AuthorizationPageModes.Authorization:
      return 'С возвращением';
    case AuthorizationPageModes.AuthAfterReg:
      return 'Теперь давайте войдём в аккаунт';
  }
  return '';
});

const buttonTitle = computed<string>(() => {
  switch (mode.value) {
    case AuthorizationPageModes.Registration:
      return 'Зарегистрироваться';
    case AuthorizationPageModes.Authorization:
      return 'Войти';
    case AuthorizationPageModes.AuthAfterReg:
      return 'Вперёд!';
  }
  return '';
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

const submitLoginForm = async () => {
  const formData: UserLoginPayload = { ...loginForm.value };
  if (!validateLogin(formData)) {
    return;
  }
  console.log(formData);
  try {
    await user.login(formData);
    router.push({
      name: AuthRoutes.AccountPage.name,
      hash: AccountPageModes.Profile
    });
  } catch(err) {
    authErrorMessage.value = (err as Error).message;
    authErrorModal.value = true;
  }
}

const submitRegForm = async () => {
  const formData: UserRegistrationPayload = {
    ...regForm.value
  }
  if (!validateReg(formData)) {
    return;
  }
  try {
    await user.register(formData);
    router.push({
      name: GuestRoutes.Authorization.name,
      hash: AuthorizationPageModes.AuthAfterReg
    });
  } catch (err) {
    authErrorMessage.value = (err as Error).message;
    authErrorModal.value = true;
  }
}

const handleSubmit = () => {
  if (mode.value === AuthorizationPageModes.Authorization
    || mode.value === AuthorizationPageModes.AuthAfterReg
  ) {
    submitLoginForm();
  } else {
    submitRegForm();
  }
};

const switchToReg = () => {
  router.push({
    hash: AuthorizationPageModes.Registration
  });
};

const switchToAuth = () => {
  router.push({
    hash: AuthorizationPageModes.Authorization
  });
}
</script>