import {defineStore} from "pinia";
import api from "@/apiClient.js";

export const useUserStore = defineStore("users", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchNotApprovedUsers(){
      this.loading = true;
      this.error = null;

      try {
        const { data } = await api.get("/users/not-approved");

        this.users = data;
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

    async approveUser(id) {
      this.loading = true;
      try {
        const { data } = await api.post(`/users/approve/${id}`);
        await this.fetchNotApprovedUsers();
        return data;
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
