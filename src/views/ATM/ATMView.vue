<script setup>
import Navigation from "@/components/Navigation.vue";
import { computed, onMounted, ref } from "vue";
import { useTransactionStore } from "@/stores/transactions.js";
import { useAuthStore } from "@/stores/auth.js";

const authStore = useAuthStore();
const transactionStore = useTransactionStore();

const amount = ref(0);

onMounted(async () => {
  await authStore.fetchUser();
});

const checkingAccount = computed(() =>
  authStore.user?.accounts?.find(a => a.type === "CHECKING")
);

const balance = computed(() =>
  checkingAccount.value?.balance ?? 0
);

async function deposit() {
  if (!checkingAccount.value) return;

  await transactionStore.deposit(
    checkingAccount.value.id,
    Number(amount.value)
  );

  await authStore.fetchUser();
}

async function withdraw() {
  if (!checkingAccount.value) return;

  await transactionStore.withdraw(
    checkingAccount.value.id,
    Number(amount.value)
  );

  await authStore.fetchUser();
}
</script>

<template>
  <Navigation />

  <h1>ATM</h1>

  <h3>Balance: €{{ balance }}</h3>

  <input
    type="number"
    v-model.number="amount"
    min="0"
    step="0.01"
    @input="amount = Math.max(0, amount)"
  />

  <div class="button-group">
    <button @click="withdraw">Withdraw</button>
    <button @click="deposit">Deposit</button>
  </div>

  <p v-if="transactionStore.error" class="error">
    {{ transactionStore.error }}
  </p>
</template>

<style scoped>
.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}
</style>
