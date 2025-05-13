import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { GuestRoutes, AuthRoutes, AdminRoutes, NotFoundRoute } from '@/router/routes.ts';
import SearchPage from '@/views/SearchPage.vue';
import AccountPage from '@/views/AccountPage.vue';
import AuthorizationPage from '@/views/AuthorizationPage.vue';
import BookingPage from '@/views/BookingPage.vue';
import TrendingFlight from '@/views/TrendingFlightPage.vue';
import NotFound from '@/views/NotFound.vue';
import { UserRole } from '@/api/types/entities/user';
import AdminPanelPage from '@/views/AdminPanelPage.vue';
import { authCheck } from '@/router/authCheck';

const routes: RouteRecordRaw[] = [
  {
     ...GuestRoutes.Search,
    component: SearchPage,
    meta: {
      requireAuth: false,
    }
  },
  {
    ...GuestRoutes.TrendingFlight,
    component: TrendingFlight,
    meta: {
      requireAuth: false,
    }
  },
  {
    ...GuestRoutes.Authorization,
    component: AuthorizationPage,
    meta: {
      requireAuth: false,
    }
  },
  {
    ...AuthRoutes.AccountPage,
    component: AccountPage,
    meta: {
      requireAuth: true,
      minRequiredRole: UserRole.Customer
    }
  },
  {
    ...AuthRoutes.BookingPage,
    component: BookingPage,
    meta: {
      requireAuth: true,
      minRequiredRole: UserRole.Customer
    }
  },
  {
    ...AdminRoutes.AdminPanelPage,
    component: AdminPanelPage,
    meta: {
      requireAuth: true,
      minRequiredRole: UserRole.Moderator
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: NotFoundRoute.path,
  },
  {
    name: NotFoundRoute.name,
    path: NotFoundRoute.path,
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach(authCheck);


export default router;
