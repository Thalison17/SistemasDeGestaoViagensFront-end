<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Cabeçalho -->
    <q-header elevated class="bg-black">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <img :src=aviao alt="Logo" class="logo" />
        </q-toolbar-title>

        <q-btn flat round dense icon="account_circle" class="q-mr-sm" />
        <q-btn flat round dense icon="notifications" />
      </q-toolbar>
    </q-header>

    <!-- Menu Lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-2"
    >
      <q-list padding>
        <q-item-label header class="text-weight-bold text-primary">
          Menu de Viagens
        </q-item-label>

        <EssentialLink
          v-for="link in travelLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- Conteúdo da Página -->
    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Rodapé -->
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center">
          © Gestao Viagens
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import aviao from 'src/assets/aviao.png'

// Links do menu lateral
const travelLinks = [
  {
    title: 'Início',
    caption: 'Página inicial',
    icon: 'home',
    link: '/'
  },
  {
    title: 'Reservas',
    caption: 'Minhas reservas',
    icon: 'flight_takeoff',
    link: '/reservas'
  },
  {
    title: 'Destinos',
    caption: 'Explore destinos',
    icon: 'map',
    link: '/destinos'
  },
  {
    title: 'Perfil',
    caption: 'Meu perfil',
    icon: 'account_circle',
    link: '/perfil'
  },
  {
    title: 'Ajuda',
    caption: 'Suporte e ajuda',
    icon: 'help',
    link: '/ajuda'
  }
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.logo {
  height: 40px;
}
</style>
