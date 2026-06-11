<script setup>
import {useAuthStore} from "@/stores/auth.js";
import router from "@/router/index.js";
import {computed, ref} from "vue";

const authStore = useAuthStore();

const formData = ref({
  firstName: "",
  lastName: "",
  bsnNumber: "",
  email: "",
  phoneNumber: "",
  password: ""
});

const isLoading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

async function handleSubmit() {
  await authStore.register(formData.value);
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
      <p v-if="error">{{ error }}</p>
      <fieldset>
        <fieldset class="grid">
          <label>
            First Name
            <input type="text" name="first-name" placeholder="First Name" aria-label="Text" v-model="formData.firstName" required>
          </label>
          <label>
            Last Name
            <input type="text" name="last-name" placeholder="Last Name" aria-label="Text" v-model="formData.lastName" required>
          </label>
        </fieldset>
        <label>
          BSN number
          <input type="text" name="bsn-number" placeholder="BSN number" aria-label="Text" v-model="formData.bsnNumber" required>
        </label>
        <label>
          Email
          <input type="email" name="email" placeholder="Email" aria-label="Email" autocomplete="email" v-model="formData.email" required>
        </label>
        <label>
          Phone number
          <input type="tel" name="phone-number" placeholder="Phone number" aria-label="Tel" autocomplete="tel" v-model="formData.phoneNumber" required>
        </label>
        <label>
          Password
          <input type="password" name="password" placeholder="Password" aria-label="Password" v-model="formData.password" required>
        </label>
      </fieldset>
      <input type="submit" value="Register"/>
    </form>
    <RouterLink to="/login">Already have an account? Log in</RouterLink>
  </section>
</template>
