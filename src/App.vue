<template>
  <router-view />
</template>

<script setup>
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Importe o Pinia
import App from './App.vue';

// Crie uma instância do Pinia
const pinia = createPinia();

// Crie a aplicação Vue
const app = createApp(App);

// Use o Pinia na aplicação
app.use(pinia);

// Monte a aplicação
app.mount('#app');
</script>

