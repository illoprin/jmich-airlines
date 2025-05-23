const GuestRoutes = {
  Search: {name: "search", path: "/"},
  Authorization: {name: "authorization", path: "/auth"},
  TrendingFlight: {name: "trending_flight", path: "/trending/:id"}
};

const AuthRoutes = {
  BookingPage: {name: "booking", path: "/booking/:id"},
  AccountPage: {name: "account", path: "/account"},
};

const NotFoundRoute = {
  name: 'not-found',
  path: '/notfound'
}

const AdminRoutes = {
  AdminPanelPage: {name: "admin-panel", path: "/admin"},
};

export { NotFoundRoute, GuestRoutes, AuthRoutes, AdminRoutes };
