<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/users.js";
import { useTransactionStore } from "@/stores/transactions.js";
import Navigation from "@/components/Navigation.vue";

const route = useRoute();

const userStore = useUserStore();
const transactionStore = useTransactionStore();

const selectedAccountId = ref(null);

onMounted(async () => {
  const user = await userStore.fetchUser(route.params.id);

  if (user?.accounts?.length) {
    selectedAccountId.value = user.accounts[0].id;
  }
});

watch(selectedAccountId, (id) => {
  if (id) {
    transactionStore.fetchTransactionsByAccount(id, 0);
  }
});
</script>

<template>
  <Navigation />

  <section v-if="userStore.user">
    <h1>{{ userStore.user.fullName }}</h1>

    <p>Email: {{ userStore.user.email }}</p>
    <p>Phone: {{ userStore.user.phoneNumber }}</p>
    <p>BSN: {{ userStore.user.bsnNumber }}</p>

    <h3>Accounts</h3>

    <select v-model="selectedAccountId">
      <option
        v-for="acc in userStore.user.accounts"
        :key="acc.id"
        :value="acc.id"
      >
        {{ acc.type }} - {{ acc.iban }} ({{ acc.balance }} €)
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
