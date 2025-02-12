<template>
  <q-page class="q-pa-md">
    <h1 class="text-h4 text-center q-mb-md">Destinos</h1>

    <div class="row q-col-gutter-md">
      <q-card
        v-for="destino in destinos"
        :key="destino.id"
        class="col-12 col-md-4 destino-card"
      >
        <!-- Adicionando router-link para cada destino -->
        <router-link :to="{ name: 'destino-detalhes', params: { id: destino.id } }" class="destino-link">
          <q-img :src="destino.imagem" class="destino-img" />
          <q-card-section>
            <div class="text-h6">{{ destino.nome }}</div>
            <p class="text-caption text-grey">{{ destino.categoria }}</p>
          </q-card-section>
        </router-link>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import rio from 'src/assets/rio.jpg'
import salvador from 'src/assets/salvador.jpg'
import recife from 'src/assets/recife.jpg'

export default {
  name: 'DestinoPage',
  setup() {
    const destinos = [
      { id: 1, nome: 'Rio de Janeiro', categoria: 'Praia', imagem: rio },
      { id: 2, nome: 'Recife', categoria: 'Cidade', imagem: recife },
      { id: 3, nome: 'Salvador', categoria: 'Histórico', imagem: salvador },
    ]

    return { destinos }
  }
}
</script>

<style scoped>
.destino-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.destino-card:hover {
  transform: scale(1.05);
}

.destino-img {
  height: 200px;
  object-fit: cover;
}

.destino-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>