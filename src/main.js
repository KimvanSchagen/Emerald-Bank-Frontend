import './assets/main.css'
import '@picocss/pico/css/pico.min.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import {useAuthStore} from "@/stores/auth.js";

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

const authStore = useAuthStore();
await authStore.initializeAuth();

app.mount('#app')
