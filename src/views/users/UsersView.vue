<script setup>
import {useUserStore} from "@/stores/users.js";
import {onMounted} from "vue";
import Navigation from "@/components/Navigation.vue";

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchNotApprovedUsers();
});
</script>

<template>
  <Navigation/>
<h1>Users to be approved</h1>
  <article aria-busy="true" v-if="userStore.loading"></article>
  <p v-if="userStore.error" class="error">
    {{ userStore.error }}
  </p>
  <table v-if="userStore.users.length" class="striped">
    <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Email</th>
      <th scope="col">Application Date</th>
      <th scope="col"></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="user in userStore.users" :key="user.id">
      <th scope="row">{{ user.fullName }} </th>
      <td>{{ user.email }}</td>
      <td>{{ new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date(user.applicationDate)) }}</td>
      <td><button @click="userStore.approveUser(user.id)" :disabled="userStore.loading">
        Approve
      </button></td>
    </tr>
    </tbody>
  </table>
  <p v-else>No users waiting for approval.</p>
</template>

<style scoped>

</style>
