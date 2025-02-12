<template>
  <q-page class="q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Detalhes da Reserva</h1>
    </div>

    <q-card v-if="reserva" class="q-pa-md">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="text-h6">{{ reserva.destino }}</div>
            <div class="text-subtitle2">Reserva #{{ reserva.numero }}</div>
            <q-chip :color="getStatusColor(reserva.status)" text-color="white" size="sm">
              {{ reserva.status }}
            </q-chip>
          </div>

          <div class="col-12">
            <div class="row items-center">
              <div class="col text-center">
                <div class="text-subtitle2">{{ reserva.origem }}</div>
                <div class="text-caption">{{ formatTime(reserva.horarioPartida) }}</div>
              </div>
              <div class="col text-center">
                <q-icon name="flight" size="sm" />
              </div>
              <div class="col text-center">
                <div class="text-subtitle2">{{ reserva.destino }}</div>
                <div class="text-caption">{{ formatTime(reserva.horarioChegada) }}</div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="text-subtitle1">Informações Adicionais</div>
            <div class="text-body1">
              adicionar alguma coisa sobre o passageiro, tipo de bagagem, peso etc.
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div v-else class="text-center q-pa-lg">
      <q-icon name="error" size="4rem" color="negative" />
      <p class="text-h6 text-grey-7">Reserva não encontrada</p>
    </div>

    <div class="q-mt-md">
      <q-btn color="primary" label="Voltar" @click="voltar" />
    </div>
  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const reserva = ref(null)

    // Funções auxiliares
    const formatTime = (datetime) => {
      return new Date(datetime).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const getStatusColor = (status) => {
      const colors = {
        Confirmada: 'positive',
        Pendente: 'warning',
        Cancelada: 'negative',
      }
      return colors[status] || 'grey'
    }

    // Carregar os detalhes da reserva
    onMounted(() => {
      const id = route.params.id
      // Aqui você pode buscar os detalhes da reserva de uma API ou de um estado global
      // Por enquanto, vamos usar um mock
      const reservasMock = [
        {
          id: 1,
          numero: 'RES001',
          origem: 'São Paulo',
          destino: 'Rio de Janeiro',
          horarioPartida: '2024-02-15T08:00:00',
          horarioChegada: '2024-02-15T09:00:00',
          status: 'Confirmada',
        },
        {
          id: 2,
          numero: 'RES002',
          origem: 'Rio de Janeiro',
          destino: 'Salvador',
          horarioPartida: '2024-03-20T10:30:00',
          horarioChegada: '2024-03-20T12:30:00',
          status: 'Pendente',
        },
        {
          id: 3,
          numero: 'RES003',
          origem: 'Brasília',
          destino: 'Recife',
          horarioPartida: '2024-02-28T15:00:00',
          horarioChegada: '2024-02-28T17:30:00',
          status: 'Cancelada',
        },
      ]

      reserva.value = reservasMock.find((r) => r.id === parseInt(id))
    })

    // Voltar para a página anterior
    const voltar = () => {
      router.go(-1)
    }

    return {
      reserva,
      formatTime,
      getStatusColor,
      voltar,
    }
  },
}
</script>

<style scoped>
/* Estilos personalizados, se necessário */
</style>
