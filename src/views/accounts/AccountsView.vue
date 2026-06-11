<script setup>
import Navigation from "@/components/Navigation.vue";
import { useAccountStore } from "@/stores/accounts.js";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";

const accountStore = useAccountStore();
const router = useRouter();

onMounted(() => {
  accountStore.fetchAllAccounts(0);
});

const groupedAccounts = computed(() => {
  const groups = {};

  (accountStore.accounts || []).forEach(account => {
    if (!groups[account.userId]) {
      groups[account.userId] = {
        userId: account.userId,
        fullName: account.fullName,
        accounts: []
      };
    }

    groups[account.userId].accounts.push(account);
  });

  return Object.values(groups);
});

function viewUser(userId) {
  router.push(`/users/${userId}`);
}
</script>

<template>
  <Navigation />

  <h1>All Accounts</h1>

  <article aria-busy="true" v-if="accountStore.loading"></article>
  <article v-else-if="accountStore.error">
    {{ accountStore.error }}
  </article>

  <table v-else>
    <thead>
    <tr>
      <th>User</th>
      <th>Type</th>
      <th>IBAN</th>
      <th>Balance</th>
    </tr>
    </thead>

    <tbody>
    <template v-for="user in groupedAccounts" :key="user.userId">
      <tr v-for="(account, index) in user.accounts" :key="account.id">

        <td v-if="index === 0" :rowspan="user.accounts.length">
          <a href="#" @click.prevent="viewUser(user.userId)">
            {{ user.fullName }}
          </a>
        </td>

        <td>{{ account.type }}</td>
        <td>{{ account.iban }}</td>
        <td>€{{ account.balance }}</td>
      </tr>
    </template>
    </tbody>
  </table>

  <!-- Pagination -->
  <div class="pagination" v-if="accountStore.totalPages > 1">
    <button
      @click="accountStore.fetchAllAccounts(accountStore.page - 1)"
      :disabled="accountStore.page === 0"
    >
      ← Previous
    </button>

    <span class="page-info">
      Page {{ accountStore.page + 1 }} of {{ accountStore.totalPages }}
    </span>

    <button
      @click="accountStore.fetchAllAccounts(accountStore.page + 1)"
      :disabled="accountStore.page + 1 >= accountStore.totalPages"
    >
      Next →
    </button>
  </div>
</template>
