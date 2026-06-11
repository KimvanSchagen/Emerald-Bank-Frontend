<script setup>
import {onMounted} from "vue";
import Navigation from "@/components/Navigation.vue";
import {useTransactionStore} from "@/stores/transactions.js";

const transactionStore = useTransactionStore();

onMounted(() => {
  transactionStore.fetchAllTransactions();
});
</script>

<template>
  <Navigation/>
  <h1>All Transactions</h1>
  <article aria-busy="true" v-if="transactionStore.loading"></article>
  <p v-if="transactionStore.error" class="error">
    {{ transactionStore.error }}
  </p>
  <table v-if="transactionStore.transactions.length" class="striped">
    <thead>
    <tr>
      <th scope="col">Type</th>
      <th scope="col">To Account User</th>
      <th scope="col">To Account id</th>
      <th scope="col">From Account User</th>
      <th scope="col">From Account id</th>
      <th scope="col">Transfer Amount</th>
      <th scope="col">Time Stamp</th>
      <th scope="col">User Initiating</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="transaction in transactionStore.transactions" :key="transaction.id">
      <th scope="row">{{ transaction.type }}</th>
      <th>{{ transaction.toUserFullName }}</th>
      <td>{{ transaction.toAccountId }}</td>
      <td>{{ transaction.fromUserFullName }}</td>
      <td>{{ transaction.fromAccountId }}</td>
      <td>{{
          new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR"
          }).format(transaction.amount)
        }}</td>
      <td>{{ new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date(transaction.date)) }}</td>
      <td>{{ transaction.initiatorId }}</td>
    </tr>
    </tbody>
  </table>
  <p v-else>No transactions available.</p>
  <div class="pagination">
    <button
      @click="transactionStore.fetchAllTransactions(transactionStore.page - 1)"
      :disabled="transactionStore.page === 0">
      ← Previous
    </button>

    <span class="page-info">
    Page {{ transactionStore.page + 1 }} of {{ transactionStore.totalPages }}
  </span>

    <button
      @click="transactionStore.fetchAllTransactions(transactionStore.page + 1)"
      :disabled="transactionStore.page + 1 >= transactionStore.totalPages">
      Next →
    </button>
  </div>

</template>
<style scoped>

</style>
