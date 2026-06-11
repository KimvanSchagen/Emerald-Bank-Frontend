<script setup>
import {useAuthStore} from "@/stores/auth.js";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import Navigation from "@/components/Navigation.vue";

const auth = useAuthStore();
const { user } = storeToRefs(auth);

onMounted(async () => {
  if (!user.value) {
    await auth.fetchUser();
  }
});
</script>

<template>
  <Navigation/>
  <h1>Dashboard</h1>

  <h4 v-if="user">
    Welcome, {{ user.fullName }}
  </h4>
  <p v-if="user?.approved == false">Your application has not yet been approved, await processing before performing any actions.</p>
</template>

<style scoped>

</style>
