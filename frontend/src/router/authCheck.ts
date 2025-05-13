import type { User, UserRole } from '@/api/types/entities/user';
import { AuthRoutes, GuestRoutes } from '@/router/routes';
import { useUserStore } from '@/store/userStore';
import {
  useRouter,
  type NavigationGuardNext,
  type RouteLocationNormalizedGeneric,
} from 'vue-router';

export async function authCheck(
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
  next: NavigationGuardNext,
) {
  if (to.meta.requireAuth) {
    const user = useUserStore();
    const router = useRouter();
    try {
      await user.verify();
      await user.fetchUser();
    } catch {
      router.push({ name: GuestRoutes.Authorization.name });
    }
    if (to.meta.minRequiredRole) {
      if (
        (user.user as User).role <
        (to.meta.minRequiredRole as UserRole)
      ) {
        router.push({ name: AuthRoutes.AccountPage.name });
      }
    }
  }
  next();
}
