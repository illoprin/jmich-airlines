const GUEST_ROUTES = {
  SEARCH_PAGE: '/',
  AUTHORIZATION_PAGE: '/auth',
};

export enum AuthorizationPageModes {
  Registration  = "registration",
  Authorization = "authorization"
}

const AUTH_ROUTES = {
  BOOKING_PAGE: '/booking',
  ACCOUNT_PAGE: '/account',
};

export { GUEST_ROUTES, AUTH_ROUTES };
