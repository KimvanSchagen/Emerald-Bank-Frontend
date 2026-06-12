import {defineStore} from "pinia";
import api from "@/apiClient.js";

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    transactions: [],
    page: 0,
    totalPages: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAllTransactions(page = 0) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get("/transactions", {
          params: {
            page,
            size: 10
          }
        });

        this.transactions = data.content;
        this.page = data.number;
        this.totalPages = data.totalPages;

      } catch (error) {
        this.error =
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong";
      } finally {
        this.loading = false;
      }
    },

    async fetchTransactionsByAccount(accountId, page = 0) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get(`/transactions/account/${accountId}`, {
          params: { page, size: 10 }
        });

        this.transactions = data.content;
        this.page = data.number;
        this.totalPages = data.totalPages;

      } catch (error) {
        this.error =
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong";
      } finally {
        this.loading = false;
      }
    },
    async deposit(accountId, amount) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post("/transactions/deposit", {
          toAccount: { id: accountId},
          amount
        });

        return data;
      } catch (error) {
        this.error = error?.response?.data?.message ||
          "Deposit failed";
      } finally {
        this.loading = false;
      }
    },
    async withdraw(accountId, amount) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.post("/transactions/withdraw", {
          fromAccount: { id: accountId },
          amount
        });

        return data;
      } catch (error) {
        this.error =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.response?.data ||
          error.message ||
          "Something went wrong";
      } finally {
        this.loading = false;
      }
    },
  }
})
