<script setup lang="ts">
import type { UserLoginPayload } from '@/api/types/requests/user';
import GlassInput from '@/components/UI/GlassInput.vue';
import GlassInputWithValidation from '@/components/UI/GlassInputWithValidation.vue';

const props = defineProps<{
  form: UserLoginPayload;
  errors: Record<string, string | null>;
}>();

const emit = defineEmits<{
  (e: 'update:form', value: UserLoginPayload): void;
}>();

const handleInput = (
  fieldName: keyof UserLoginPayload,
  value: string | number,
) => {
  emit('update:form', {
    ...props.form,
    [fieldName]: value,
  });
};

</script>

<template>
    

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


</template>

<style scoped></style>