// Router default import
import { createRouter, createWebHistory } from "vue-router";

// Order & purchase
import Search from '@/views/Search.vue';
import Purchase from '@/views/Purchase.vue';

// Authorization
import Auth from '@/views/Auth.vue';
import LoginForm from '@/components/sections/LoginForm.vue';
import RegForm from '@/components/sections/RegForm.vue';

// User
import User from '@/views/User.vue';
import UserData from '@/components/sections/UserData.vue';
import UserOrder from '@/components/sections/UserOrder.vue';
import UserEdit from '@/components/sections/UserEdit.vue';

// Import admin views
import Admin from '@/views/Admin.vue';
import AdminFlights from '@/components/sections/AdminFlights.vue';
import AdminOrder from '@/components/sections/AdminOrder.vue';
import AdminStat from '@/components/sections/AdminStat.vue';
import AdminStatic from '@/components/sections/AdminStatic.vue';

// Import config and api
import { ADMIN_ROUTES, AUTH_ROUTES, GUEST_ROUTES } from "@/utils/config";


const routes = [
	{
		name: 'search',
		component: Search,
		path: GUEST_ROUTES.SEARCH_ROUTE,
		meta: {
			require_auth: false,
			require_admin: false,
		}
	},
	{
		name: 'purchase',
		component: Purchase,
		path: AUTH_ROUTES.PURCHASE_ROUTE + '/:flight_id/:seats',
		meta: {
			require_auth: true,
			require_admin: false,
		}
	},
	{
		name: 'user',
		component: User,
		path: AUTH_ROUTES.USER_ROUTE,
		meta: {
			require_auth: true,
			require_admin: false,
		},
		children: [
			{
				name: 'user-data',
				component: UserData,
				path: AUTH_ROUTES.USER_DATA_ROUTE,
			},
			{
				name: 'user-order',
				component: UserOrder,
				path: AUTH_ROUTES.USER_ORDER_ROUTE,
			},
			{
				name: 'user-edit',
				component: UserEdit,
				path: AUTH_ROUTES.USER_EDIT_ROUTE,
			}
		]
	},
	{
		name: 'auth',
		component: Auth,
		path: GUEST_ROUTES.AUTH_ROUTE,
		meta: {
			require_admin: false,
			require_auth: false
		},
		children: [
			{
				name: 'auth-login',
				component: LoginForm,
				path: GUEST_ROUTES.LOGIN_ROUTE
			},
			{
				name: 'auth-reg',
				component: RegForm,
				path: GUEST_ROUTES.REG_ROUTE
			}
		]
	},
	{
		name: 'admin',
		component: Admin,
		path: ADMIN_ROUTES.ADMIN_ROUTE,
		meta: {
			require_auth: true,
			require_admin: true,
		},
		children: [
			{
				name: 'admin-flight',
				component: AdminFlights,
				path: ADMIN_ROUTES.ADMIN_FLIGHT_ROUTE
			},
			{
				name: 'admin-order',
				component: AdminOrder,
				path: ADMIN_ROUTES.ADMIN_ORDER_ROUTE
			},
			{
				name: 'admin-static',
				component: AdminStatic,
				path: ADMIN_ROUTES.ADMIN_STATIC_ROUTE
			},
			{
				name: 'admin-stat',
				component: AdminStat,
				path: ADMIN_ROUTES.ADMIN_STATISTICS_ROUTE
			},
		]
	}
]

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes
});

export default router;
