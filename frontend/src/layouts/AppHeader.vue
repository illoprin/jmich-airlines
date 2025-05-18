

<template>
  <div class="d-flex justify-content-between align-items-center mb-4">
    <img
      :src="JmichLogoWide"
      class="header-logo"
      alt="Jmich.Airlines logo"
      @click="$router.push({name: GuestRoutes.Search.name})"
    >
    <RouterLink
      :to="GuestRoutes.Authorization.path"
      class="auth-link"
      v-if="!user.isAuthenticated"
    >
      Авторизация
    </RouterLink>

    <div
      class="account-link"
      v-else-if="user.isAuthenticated"
      ref="accountDropdownRoot"
    >
      <img :src="UserIco" class="md-icon" alt="">
      <div
        :to="GuestRoutes.Authorization.path"
        @click="() => accountDropdownVisible = !accountDropdownVisible"
      >
        {{ fs }}
      </div>
      <GlassDropDown
        :options="accountDropdownOptions"
        :onSelect="handleDropdownSelection"
        :root="accountDropdownRoot"
        v-model:visible="accountDropdownVisible"
      />
    </div>
  </div>
</template>

<script setup lang="ts">

import JmichLogoWide from '@/assets/icons/jmich-logo-wide.svg';
import LikeIco from '@/assets/icons/like.svg'
import WrenchIco from '@/assets/icons/wrench.svg'
import TicketIco from '@/assets/icons/ticket.svg'
import ExitIco from '@/assets/icons/exit.svg'
import TrashIco from '@/assets/icons/trash-bin.svg'

import { RouterLink, useRouter } from "vue-router";
import { AuthRoutes, GuestRoutes } from "@/router/routes.ts";
import UserIco from '@/assets/icons/person.svg';
import { useUserStore } from "@/store/userStore";
import { computed, onMounted, ref } from "vue";
import type { Option } from "@/types/ui/option";
import GlassDropDown from '@/components/UI/GlassDropDown.vue';
import { AccountPageModes } from '@/types/hash/account';

const user = useUserStore();
const fs = computed<string>(() =>
  (user.user?.firstname + " " + user.user?.secondname)
);
const accountDropdownRoot = ref<HTMLElement | undefined>(undefined);
const accountDropdownVisible = ref<boolean>(false);

const router = useRouter();

onMounted(async () => {
  if (user.isAuthenticated)
    await user.fetchUser();
})

enum AccountDropdownValues {
  Profile = "profile",
  Liked = "liked",
  MyTickets = "tickets",
  Settings = "settings",
  Exit = "exit",
  Remove = "delete"
}

const accountDropdownOptions: Option[] = [
  {
    title: "Личный кабинет",
    selectable: true,
    value: AccountDropdownValues.Profile,
    suboptions: [
      {
        title: "Понравившиеся рейсы",
        selectable: true,
        value: AccountDropdownValues.Liked,
        icon: LikeIco
      },
      {
        title: "Мои билеты",
        selectable: true,
        value: AccountDropdownValues.MyTickets,
        icon: TicketIco
      },
      {
        title: "Управление аккаунтом",
        selectable: true,
        value: AccountDropdownValues.Settings,
        icon: WrenchIco
      }
    ]
  },
  {
    title: "Выйти из аккаунта",
    selectable: true,
    value: AccountDropdownValues.Exit,
    classes: "text-danger",
    icon: ExitIco
  },
  {
    title: "Удалить аккаунт",
    selectable: true,
    value: AccountDropdownValues.Remove,
    classes: "text-white bg-danger",
    icon: TrashIco
  },
];

const handleDropdownSelection = (option: Option) => {
  switch(option.value) {
    case AccountDropdownValues.Profile:
      router.push({ name: AuthRoutes.AccountPage.name, hash: AccountPageModes.Profile });
      break;
    case AccountDropdownValues.Settings:
      router.push({ name: AuthRoutes.AccountPage.name, hash: AccountPageModes.Settings });
      break;
    case AccountDropdownValues.MyTickets:
      router.push({ name: AuthRoutes.AccountPage.name, hash: AccountPageModes.Tickets });
      break;
    case AccountDropdownValues.Liked:
      router.push({ name: AuthRoutes.AccountPage.name, hash: AccountPageModes.Liked });
      break;
    case AccountDropdownValues.Exit:
      user.logout();
      router.push({ name: GuestRoutes.Authorization.name });
      break;
    case AccountDropdownValues.Remove:
      user.remove();
      router.push({ name: GuestRoutes.Authorization.name });
      break;
  }
}

</script>

<style scoped>
.auth-link {
  user-select: none;
  font-size: 1rem;
  color: white;
  text-decoration: none;
}
.auth-link > * {
  user-select: none;
}
.account-link {
  position: relative;
  display: flex;
  gap: 0.5rem;
}
.account-link:hover {
  cursor: pointer;
}
</style>