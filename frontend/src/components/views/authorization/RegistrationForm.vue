<script setup lang="ts">
import type { UserRegistrationPayload } from '@/api/types/requests/user';
import GlassInputWithValidation from '@/components/UI/GlassInputWithValidation.vue';


const props = defineProps<{
  form: UserRegistrationPayload;
  errors: Record<string, string | null>;
}>();

const emit = defineEmits<{
  (e: 'update:form', value: UserRegistrationPayload): void;
}>();

const handleInput = (
  fieldName: keyof UserRegistrationPayload,
  value: string | number,
) => {
  emit('update:form', {
    ...props.form,
    [fieldName]: value,
  });
};

</script>

<template>
  <div>
    <strong class="fs-4 d-block mb-4">
      Расскажите о себе
    </strong>

    <GlassInputWithValidation
      type="text"
      className="mb-3"
      placeholder="Имя"
      @input="(e: Event) => handleInput('firstname', (e.target as HTMLInputElement).value)"
      :error="errors['firstname'] as any"
    />
    <GlassInputWithValidation
      type="text"
      className="mb-3"
      placeholder="Фамилия"
      @input="(e: Event) => handleInput('secondname', (e.target as HTMLInputElement).value)"
      :error="errors['secondname'] as any"
    />
    <GlassInputWithValidation
      type="text"
      className="mb-3"
      placeholder="Телефон"
      @input="(e: Event) => handleInput('phone', (e.target as HTMLInputElement).value)"
      :error="errors['phone'] as any"
    />
    <GlassInputWithValidation
      type="text"
      className="mb-3"
      placeholder="E-mail"
      @input="(e: Event) => handleInput('email', (e.target as HTMLInputElement).value)"
      :error="errors['email'] as any"
    />
    <GlassInputWithValidation
      type="text"
      className="mb-3"
      placeholder="Логин"
      @input="(e: Event) => handleInput('login', (e.target as HTMLInputElement).value)"
      :error="errors['login'] as any"
    />
    <GlassInputWithValidation
      type="password"
      className="mb-3"
      placeholder="Пароль"
      @input="(e: Event) => handleInput('password', (e.target as HTMLInputElement).value)"
      :error="errors['password'] as any"
    />
  </div>
</template>

<style scoped></style>