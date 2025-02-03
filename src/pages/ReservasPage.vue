<template>
  <q-page class="reservas-page q-pa-md">
    <!-- Cabeçalho -->
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Minhas Reservas</h1>
      <p class="text-subtitle1">Gerencie todas as suas viagens em um só lugar</p>
    </div>

    <!-- Filtros -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-input
          v-model="search"
          outlined
          dense
          label="Buscar reserva"
          :placeholder="'Busque por destino ou número da reserva'"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          outlined
          dense
          label="Status"
        />
      </div>
      <div class="col-12 col-md-4">
        <q-select
          v-model="dateFilter"
          :options="dateOptions"
          outlined
          dense
          label="Período"
        />
      </div>
    </div>

    <!-- Lista de Reservas -->
    <div class="row q-col-gutter-md">
      <div v-for="reserva in filteredReservas" :key="reserva.id" class="col-12">
        <q-card class="reserva-card">
          <q-card-section>
            <div class="row items-center justify-between">
              <!-- Informações Principais -->
              <div class="col-12 col-md-4">
                <div class="text-h6">{{ reserva.destino }}</div>
                <div class="text-subtitle2">Reserva #{{ reserva.numero }}</div>
                <q-chip
                  :color="getStatusColor(reserva.status)"
                  text-color="white"
                  size="sm"
                >
                  {{ reserva.status }}
                </q-chip>
              </div>

              <!-- Detalhes do Voo -->
              <div class="col-12 col-md-4 q-pt-md-0 q-pt-sm">
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

              <!-- Ações -->
              <div class="col-12 col-md-4 text-right">
                <q-btn-group spread>
                  <q-btn
                    color="primary"
                    label="Ver Detalhes"
                    icon="visibility"
                    @click="verDetalhes(reserva.id)"
                  />
                  <q-btn
                    :color="reserva.status === 'Confirmada' ? 'negative' : 'grey'"
                    :label="reserva.status === 'Confirmada' ? 'Cancelar' : 'Cancelado'"
                    icon="close"
                    :disable="reserva.status !== 'Confirmada'"
                    @click="cancelarReserva(reserva.id)"
                  />
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Mensagem quando não há reservas -->
    <div v-if="filteredReservas.length === 0" class="text-center q-pa-lg">
      <q-icon name="flight_takeoff" size="4rem" color="grey-5" />
      <p class="text-h6 text-grey-7">Nenhuma reserva encontrada</p>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default {
  setup() {
    const $q = useQuasar()
    const search = ref('')
    const statusFilter = ref('Todos')
    const dateFilter = ref('Todos')

    // Opções para os filtros
    const statusOptions = ['Todos', 'Confirmada', 'Pendente', 'Cancelada']
    const dateOptions = ['Todos', 'Próximos 7 dias', 'Próximo mês', 'Próximos 3 meses']

    // Dados mockados das reservas
    const reservas = ref([
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
    ])

    // Filtragem das reservas
    const filteredReservas = computed(() => {
      return reservas.value.filter(reserva => {
        const matchSearch = search.value === '' ||
          reserva.destino.toLowerCase().includes(search.value.toLowerCase()) ||
          reserva.numero.toLowerCase().includes(search.value.toLowerCase())

        const matchStatus = statusFilter.value === 'Todos' ||
          reserva.status === statusFilter.value

        return matchSearch && matchStatus
      })
    })

    // Funções auxiliares
    const formatTime = (datetime) => {
      return new Date(datetime).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const getStatusColor = (status) => {
      const colors = {
        'Confirmada': 'positive',
        'Pendente': 'warning',
        'Cancelada': 'negative'
      }
      return colors[status] || 'grey'
    }

    // Ações
    const verDetalhes = (id) => {
      // Implementar navegação para página de detalhes
      console.log('Ver detalhes da reserva:', id)
    }

    const cancelarReserva = (id) => {
      $q.dialog({
        title: 'Confirmar cancelamento',
        message: 'Tem certeza que deseja cancelar esta reserva?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        // Implementar lógica de cancelamento
        const reserva = reservas.value.find(r => r.id === id)
        if (reserva) {
          reserva.status = 'Cancelada'
        }
        $q.notify({
          color: 'negative',
          message: 'Reserva cancelada com sucesso',
          icon: 'close'
        })
      })
    }

    return {
      search,
      statusFilter,
      dateFilter,
      statusOptions,
      dateOptions,
      filteredReservas,
      formatTime,
      getStatusColor,
      verDetalhes,
      cancelarReserva
    }
  }
}
</script>

<style scoped>
.reservas-page {
  max-width: 1200px;
  margin: 0 auto;
}

.reserva-card {
  transition: transform 0.2s ease;
}

.reserva-card:hover {
  transform: translateY(-2px);
}
</style>
