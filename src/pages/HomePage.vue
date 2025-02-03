<template>
  <q-page class="home-page q-pa-md">
    <!-- Cabeçalho -->
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Bem-vindo ao **DECIDIR NOME**</h1>
      <p class="text-subtitle1">Gerencie suas viagens de avião de forma fácil e rápida.</p>
    </div>

    <!-- Seção de Destinos Populares -->
    <div class="q-mb-xl">
      <h2 class="text-h4 text-weight-bold q-mb-md">Destinos Populares</h2>
      <div class="row q-col-gutter-md">
        <div
          v-for="destination in popularDestinations"
          :key="destination.name"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card class="destination-card">
            <q-img :src="destination.image" :alt="destination.name" />
            <q-card-section>
              <div class="text-h6">{{ destination.name }}</div>
              <div class="text-subtitle2">{{ destination.description }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Seção de Ofertas Especiais -->
    <div>
      <h2 class="text-h4 text-weight-bold q-mb-md">Ofertas Especiais</h2>
      <div class="row q-col-gutter-md">
        <div
          v-for="offer in specialOffers"
          :key="offer.title"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card class="offer-card">
            <q-card-section>
              <div class="text-h6">{{ offer.title }}</div>
              <div class="text-subtitle2">{{ offer.description }}</div>
              <div class="text-h6 text-primary q-mt-sm">{{ offer.price }}</div>
            </q-card-section>
            <q-card-actions>
              <q-btn color="primary" label="Reservar Agora" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import toquio from 'src/assets/toquio.jpg'
import newyork from 'src/assets/newyork.jpg'
import paris from 'src/assets/paris.jpg'

export default {
  methods: {
    navigateTo (routeName) {
      this.$router.push({ name: routeName })
    },
  },
  setup() {
    // Dados de destinos populares
    const popularDestinations = ref([
      {
        name: 'Paris',
        description: 'A cidade das luzes e do amor.',
        image: paris,
      },
      {
        name: 'Nova York',
        description: 'A cidade que nunca dorme.',
        image: newyork,
      },
      {
        name: 'Tóquio',
        description: 'Uma mistura de tradição e modernidade.',
        image: toquio,
      },
    ])

    // Dados de ofertas especiais
    const specialOffers = ref([
      {
        title: 'Pacote para Bali',
        description: '7 noites em um resort luxuoso.',
        price: 'R$ 3.499,00',
      },
      {
        title: 'Viagem para o Caribe',
        description: '5 noites com tudo incluído.',
        price: 'R$ 2.999,00',
      },
      {
        title: 'Tour pela Europa',
        description: '10 dias visitando 5 países.',
        price: 'R$ 5.999,00',
      },
    ])

    return {
      popularDestinations,
      specialOffers,
    }
  },
}
</script>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
}
.destination-card,
.offer-card {
  transition: transform 0.3s ease;
}
.destination-card:hover,
.offer-card:hover {
  transform: translateY(-5px);
}
</style>
