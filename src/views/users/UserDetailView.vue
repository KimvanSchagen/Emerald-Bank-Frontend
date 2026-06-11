<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/users.js";
import { useTransactionStore } from "@/stores/transactions.js";
import { useAuthStore } from "@/stores/auth.js";
import Navigation from "@/components/Navigation.vue";

const route = useRoute();

const authStore = useAuthStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();

const selectedAccountId = ref(null);

const activeUser = computed(() => {
  return authStore.user?.role === "CUSTOMER"
    ? authStore.user
    : userStore.user;
});

const totalBalance = computed(() => {
  if (!activeUser.value?.accounts) return 0;

  return activeUser.value.accounts.reduce((sum, acc) => {
    return sum + (acc.balance || 0);
  }, 0);
});

onMounted(async () => {
  let user;

  // CUSTOMER → use /me (authStore already holds it)
  if (authStore.user?.role === "CUSTOMER") {
    user = authStore.user;
  }

  // EMPLOYEE → load user by id
  else {
    user = await userStore.fetchUser(route.params.id);
  }

  if (!user?.accounts?.length) return;

  selectedAccountId.value = user.accounts[0].id;

  await transactionStore.fetchTransactionsByAccount(
    selectedAccountId.value,
    0
  );
});

watch(selectedAccountId, (id) => {
  if (!id) return;

  transactionStore.fetchTransactionsByAccount(id, 0);
});
</script>

<template>
  <Navigation />

  <section v-if="activeUser">
    <h1>{{ activeUser.fullName }}</h1>

    <p>Email: {{ activeUser.email }}</p>
    <p>Phone: {{ activeUser.phoneNumber }}</p>
    <p>BSN: {{ activeUser.bsnNumber }}</p>

    <p><strong>Total Balance:</strong> € {{ totalBalance.toFixed(2) }}</p>

    <h3>Accounts</h3>

    <select v-model="selectedAccountId">
      <option
        v-for="acc in activeUser.accounts"
        :key="acc.id"
        :value="acc.id"
      >
        {{ acc.type }} - {{ acc.iban }} (€ {{ acc.balance }})
      </option>
    </select>

    <h3>Transactions</h3>

    <table>
      <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>From</th>
        <th>To</th>
        <th>Amount</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="t in transactionStore.transactions" :key="t.id">
        <td>{{ new Date(t.date).toLocaleString() }}</td>
        <td>{{ t.type }}</td>
        <td>{{ t.fromUserFullName }}</td>
        <td>{{ t.toUserFullName }}</td>
        <td>€ {{ t.amount }}</td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button
        @click="transactionStore.fetchTransactionsByAccount(selectedAccountId, transactionStore.page - 1)"
        :disabled="transactionStore.page === 0"
      >
        ← Previous
      </button>

      <span>
        Page {{ transactionStore.page + 1 }} of {{ transactionStore.totalPages }}
      </span>

      <button
        @click="transactionStore.fetchTransactionsByAccount(selectedAccountId, transactionStore.page + 1)"
        :disabled="transactionStore.page + 1 >= transactionStore.totalPages"
      >
        Next →
      </button>
    </div>
  </section>
</template>
