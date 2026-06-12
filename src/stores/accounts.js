import {defineStore} from "pinia";
import api from "@/apiClient.js";

export const useAccountStore = defineStore("accounts", {
  state: () => ({
    accounts: [],
    page: 0,
    totalPages: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAccountsByFullName(fullName) {
      this.loading = true;
      this.error = null;
      try {
        const parts = fullName.trim().split(" ");

        const firstName = parts[0];
        const lastName = parts.slice(1).join(" ");

        const { data } = await api.get("/accounts/find", {
          params: {
            firstName,
            lastName
          }
        });
        return data;
      } catch (error) {
        this.error =
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong";
      } finally {
        this.loading = false;
      }
    },

    async fetchAllAccounts(page = 0) {
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get("/accounts", {
          params: {
            page,
            size: 10
          }
        });

        this.accounts = data.content;
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
    }
  }
})
