import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { GuestRoutes, AuthRoutes, AdminRoutes } from '@/router/routes.ts';
import SearchPage from '@/views/SearchPage.vue';
import AccountPage from '@/views/AccountPage.vue';
import AuthorizationPage from '@/views/AuthorizationPage.vue';
import BookingPage from '@/views/BookingPage.vue';
import TrendingFlight from '@/views/TrendingFlightPage.vue';

const routes: RouteRecordRaw[] = [
  {
     ...GuestRoutes.Search,
    component: SearchPage,
  },
  {
    ...GuestRoutes.TrendingFlight,
    component: TrendingFlight,
  },
  {
    ...GuestRoutes.Authorization,
    component: AuthorizationPage,
  },
  {
    ...AuthRoutes.AccountPage,
    component: AccountPage,
  },
  {
    ...AuthRoutes.BookingPage,
    component: BookingPage,
  },
  {
    ...AdminRoutes.AdminPanelPage,
    component: BookingPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
