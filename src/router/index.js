import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import DashboardView from "@/views/dashboard/DashboardView.vue";
import {useAuthStore} from "@/stores/auth.js";
import TransactionsView from "@/views/transactions/TransactionsView.vue";
import UsersView from "@/views/users/UsersView.vue";
import AccountsView from "@/views/accounts/AccountsView.vue";
import UserDetailView from "@/views/users/UserDetailView.vue";
import ATMView from "@/views/ATM/ATMView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true, role: 'EMPLOYEE' }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true, role: 'EMPLOYEE' }
    },
    {
      path: '/users/:id',
      name: 'user-overview',
      component: UserDetailView,
      meta: { requiresAuth: true}
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: AccountsView,
      meta: { requiresAuth: true, role: 'EMPLOYEE' }
    },
    {
      path: '/atm',
      name: 'atm',
      component: ATMView,
      meta: { requiresAuth: true, role: 'CUSTOMER' }
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next("/login");
  }

  // Prevent logged-in users from accessing login/register
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return next("/");
  }

  const user = authStore.user;
  if (
    user?.role === "CUSTOMER" &&
    user?.approved === false &&
    to.path !== "/"
  ) {
    return next("/");
  }

  // Check role-based access
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return next("/");
  }

  next();
});

export default router
