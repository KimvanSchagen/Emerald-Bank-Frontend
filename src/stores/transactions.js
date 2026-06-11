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
  }
})
