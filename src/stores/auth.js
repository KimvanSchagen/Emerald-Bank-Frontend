import {defineStore} from "pinia";
import api, {setAuthToken} from "@/apiClient.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async fetchUser() {
      if (!this.token) return;

      try {
        const response = await api.get("/users/me");
        this.user = response.data;
        return response;
      } catch (error) {
        this.error = error.response?.data?.message;
      }
    },

    async register(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/auth/register",
          credentials
        );

        this.token = response.data.token;

        localStorage.setItem("token", this.token);
        setAuthToken(this.token);

        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Registration failed";
      } finally {
        this.loading = false;
      }
    },

    async login(credentials) {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.post("/auth/login",
          credentials
        );

        this.token = response.data.token;

        localStorage.setItem("token", this.token);
        setAuthToken(this.token);

        return response;
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed";
      } finally {
        this.loading = false;
      }

    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
      setAuthToken(null);
    },

    async initializeAuth() {
      const token = localStorage.getItem("token");
      if (token) {
        this.token = token;
        setAuthToken(token);
        try {
          await this.fetchUser();
        } catch (error) {
          this.logout();
        }
      }
    },
  },
});
