import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import SearchPage from '@/views/SearchPage.vue';
import AccountPage from '@/views/AccountPage.vue';
import AuthorizationPage from '@/views/AuthorizationPage.vue';
import BookingPage from '@/views/BookingPage.vue';
import { AUTH_ROUTES, GUEST_ROUTES } from '@/router/routes.ts';

const routes: RouteRecordRaw[] = [
  {
    path     : GUEST_ROUTES.SEARCH_PAGE,
    component: SearchPage,
  },
  {
    path     : GUEST_ROUTES.AUTHORIZATION_PAGE,
    component: AuthorizationPage,
  },
  {
    path     : AUTH_ROUTES.ACCOUNT_PAGE,
    component: AccountPage,
  },
  {
    path     : AUTH_ROUTES.BOOKING_PAGE,
    component: BookingPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
