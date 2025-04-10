export const SERVER_URL = 'http://localhost:8001';
export const CONNECTION_INTERVAL = 30000;

// URLs
export const AUTH_ROUTES = {
	USER_ROUTE: '/user',
	USER_DATA_ROUTE: 'data',
	USER_ORDER_ROUTE: 'order',
	USER_EDIT_ROUTE: 'edit',

	PURCHASE_ROUTE: '/purchase',
}

export const GUEST_ROUTES = {
	SEARCH_ROUTE: '/',
	AUTH_ROUTE: '/auth',
	LOGIN_ROUTE: 'login',
	REG_ROUTE: 'reg'
}

// В dropdown'е пользователя появляется пункт админ-панель
export const ADMIN_ROUTES = {
	ADMIN_ROUTE: '/admin',
	ADMIN_STATIC_ROUTE: 'static', // Добавить город или компанию
	ADMIN_FLIGHT_ROUTE: 'flight', // Добавить рейс, изменить данные рейса
	ADMIN_ORDER_ROUTE: 'order', // просмотр всех заказов
	ADMIN_CLIENT_ROUTE: 'client', // Страница для просмотра профилей всех пользователей
	ADMIN_STATISTICS_ROUTE: 'statistics' // Просмотр статистики сервиса
}





