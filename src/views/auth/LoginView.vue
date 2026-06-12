<script setup>
import {useAuthStore} from "@/stores/auth.js";
import {computed, ref} from "vue";
import router from "@/router/index.js";

const authStore = useAuthStore();

const formData = ref({
  email: "",
  password: ""
});

const isLoading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

async function handleSubmit() {
  await authStore.login(formData.value);
  if (!authStore.error) {
    await router.push("/");
  }
}
</script>

<template>
  <h1>Emerald Bank</h1>

  <section>
    <form @submit.prevent="handleSubmit">
      <article aria-busy="true" v-if="isLoading"></article>
      <p v-if="error" class="error">{{ error }}</p>
      <fieldset>
        <label>
          Email
          <input type="email" name="email" placeholder="Email" aria-label="Email" autocomplete="email" v-model="formData.email" required>
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Password" aria-label="Password" v-model="formData.password" required>
        </label>
      </fieldset>

      <input type="submit" value="Login"/>
    </form>
    <RouterLink to="/register">First time here? Create your account</RouterLink>
  </section>
</template>
