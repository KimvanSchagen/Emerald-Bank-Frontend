<script setup>
import { useAuthStore } from "@/stores/auth.js";
import router from "@/router/index.js";

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>

<template>
<nav>
  <ul>
    <li><h2><strong>Emerald Bank</strong></h2></li>
  </ul>
  <ul>
    <li><RouterLink to="/">Home</RouterLink></li>
    <template v-if="authStore.user?.approved !== false">
      <li v-if="authStore.user?.role === 'CUSTOMER'">
        <RouterLink :to="`/users/${authStore.user?.id}`">My Details</RouterLink>
      </li>
      <li v-if="authStore.user?.role === 'CUSTOMER'">
        <RouterLink to="/atm">ATM</RouterLink>
      </li>
      <li v-if="authStore.user?.role === 'EMPLOYEE'">
        <RouterLink to="/users">Users</RouterLink>
      </li>
      <li v-if="authStore.user?.role === 'EMPLOYEE'">
        <RouterLink to="/accounts">Accounts</RouterLink>
      </li>
      <li v-if="authStore.user?.role === 'EMPLOYEE'">
        <RouterLink to="/transactions">Transactions</RouterLink>
      </li>
      <li>
        <RouterLink to="/transfer">Transfer</RouterLink>
      </li>
    </template>
    <li v-if="authStore.isAuthenticated">
      <a @click="handleLogout">Logout</a>
    </li>
  </ul>
</nav>
</template>

<style scoped>

</style>
