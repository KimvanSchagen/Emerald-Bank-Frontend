<script setup>
import Navigation from "@/components/Navigation.vue";
import {computed, onMounted, ref, watch} from "vue";
import {useAccountStore} from "@/stores/accounts.js";
import {useTransactionStore} from "@/stores/transactions.js";
import {useAuthStore} from "@/stores/auth.js";

const authStore = useAuthStore();
const accountStore = useAccountStore();
const transactionStore = useTransactionStore();

const fromAccountId = ref(null);
const toAccountId = ref(null);
const transferToSavings = ref(false);
const recipientName = ref("");
const senderName = ref("");
const recipientAccount = ref(null);
const senderAccount = ref(null);

const amount = ref("");

const isLoaded = computed(() =>
  authStore.user !== null
);

const isEmployee = computed(() =>
  authStore.user?.role === "EMPLOYEE"
);

const selectedFromAccount = computed(() => {
  if (!authStore.user) {
    return null;
  }

  return authStore.user.accounts.find(
    a => a.id === fromAccountId.value
  );
});

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser();
  }

  if (
    authStore.user &&
    authStore.user.accounts.length > 0
  ) {
    fromAccountId.value = authStore.user.accounts[0].id;
  }
});

async function searchRecipient() {
  const account =
    await accountStore.fetchAccountsByFullName(recipientName.value);

  if (account) {
    recipientAccount.value = account;
    toAccountId.value = account.id;
  }
}

async function searchSender() {
  const account =
    await accountStore.fetchAccountsByFullName(senderName.value);

  if (account) {
    senderAccount.value = account;
    fromAccountId.value = account.id;
  }
}

async function doTransfer() {
  await transactionStore.transfer(
    fromAccountId.value,
    toAccountId.value,
    amount.value
  );

  await authStore.fetchUser();

  amount.value = "";
  recipientName.value = "";
}

watch(selectedFromAccount, (account) => {
  if (!authStore.user) return;

  if (account?.type === "SAVINGS") {
    toAccountId.value = authStore.user.accounts.find(
      a => a.type === "CHECKING"
    )?.id;
  }
});

watch(transferToSavings, (isSavings) => {
  if (!authStore.user) return;

  if (isSavings) {
    toAccountId.value = authStore.user.accounts.find(
      a => a.type === "SAVINGS"
    )?.id;
  } else {
    toAccountId.value = null;
  }
});
</script>

<template>
  <Navigation/>

  <h1>Transfer</h1>

  <div v-if="!isLoaded">
    <article aria-busy="true"></article>
  </div>

  <!-- CUSTOMER -->
  <div v-else-if="!isEmployee">
    <label>From account</label>

    <select v-if="authStore.user" v-model="fromAccountId">
      <option
        v-for="account in authStore.user.accounts"
        :key="account.id"
        :value="account.id">

        {{ account.type }} - Balance: €{{ account.balance }}
      </option>
    </select>


    <!-- FROM SAVINGS -->
    <div v-if="selectedFromAccount?.type === 'SAVINGS'">
      <label>To account</label>
      <p>
        CHECKING(€{{
          authStore.user.accounts.find(
            a => a.type === 'CHECKING'
          )?.balance
        }})
      </p>
    </div>

    <!-- FROM CHECKING -->
    <div v-else-if="selectedFromAccount">
      <label>
        <input
          type="checkbox"
          v-model="transferToSavings"
          role="switch"
        />
        Transfer to my savings account
      </label>

      <div v-if="!transferToSavings">
        <label>Recipient full name</label>
        <fieldset role="group">
          <input v-model="recipientName" placeholder="John Doe"/>
          <button @click="searchRecipient">
            Search
          </button>
        </fieldset>
      </div>

      <div v-if="recipientAccount" class="container">
        <p><strong>{{ recipientAccount.fullName }}</strong></p>
        <p>IBAN: {{ recipientAccount.iban }}</p>
      </div>
    </div>
  </div>

  <!-- EMPLOYEE -->
  <div v-else>
    <label>Sender full name</label>
    <fieldset role="group">
      <input v-model="senderName" placeholder="John Doe"/>
      <button @click="searchSender">
        Search
      </button>
    </fieldset>
    <div v-if="senderAccount" class="container">
      <p><strong>{{ senderAccount.fullName }}</strong></p>
      <p>IBAN: {{ senderAccount.iban }}</p>
      <p>Type: {{ senderAccount.type }}</p>
    </div>

    <label>Recipient full name</label>
    <fieldset role="group">
      <input v-model="recipientName" placeholder="Jane Doe"/>
      <button @click="searchRecipient">
        Search
      </button>
    </fieldset>
    <div v-if="recipientAccount" class="container">
      <p><strong>{{ recipientAccount.fullName }}</strong></p>
      <p>IBAN: {{ recipientAccount.iban }}</p>
    </div>
  </div>
  <hr>

  <label>Amount</label>
  <input
    type="number"
    step="0.01"
    min="0"
    v-model.number="amount"
    @input="amount = Math.max(0, amount)"
  >

  <button @click="doTransfer" :disabled="!fromAccountId || !toAccountId || !amount">
    Transfer
  </button>

  <p v-if="transactionStore.error" class="error">
    {{ transactionStore.error }}
  </p>
</template>
