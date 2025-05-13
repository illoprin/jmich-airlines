<template>
  <div class="not-found__container h-100">
    <h1
      class="b-block text-danger not-found__title"
    >
      404 <p class="float-end fs-3 text-white-50">Страница не найдена</p>
    </h1>
    <div class="m-auto">
      <p class="fw-light fs-5 text-center">
        Ты ошибся дверью, дружок. Клуб кожевенного ремесла 2 блока вниз.
      </p>
      <button class="glass-button glass-border text-center w-50 m-auto d-block" @click="handleRedirection">
        {{ buttonText }}
      </button>

    </div>  
  </div>
</template>

<script setup lang="ts">
import { AuthRoutes, GuestRoutes } from '@/router/routes';
import { useUserStore } from '@/store/userStore';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const isAuth = ref<boolean>(false);
const router = useRouter();
const user = useUserStore();

onMounted(async () => {
  isAuth.value = await user.verify();
});

function handleRedirection() {
  if (isAuth.value) {
    router.push({
      name: AuthRoutes.AccountPage.name,
      hash: '#profile',
    });
    return;
  }
  router.push({
    name: GuestRoutes.Search.name,
  });
}

const buttonText = computed<string>(() => {
  if (isAuth.value === true) {
    return 'В личный кабинет';
  }
  return 'На главную';
})

</script>

<style scoped>
.not-found__container {
  display: flex;
  flex-flow: column nowrap;
  align-items: start;
  justify-items: flex-start;
  flex-grow: 1;
}
.not-found__title {
   font-size: calc(var(--index) * 5);
}
</style>