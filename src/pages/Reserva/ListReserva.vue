<template>
    <div class="reservas-page q-pa-md">
      <div class="text-center q-mb-lg">
        <h1 class="text-h3 text-weight-bold text-primary">Reservas</h1>
        <p class="text-subtitle1">Gerenciamento de reservas</p>
      </div>
  
      <div class="row justify-center">
        <div class="col-12 col-md-10">
          <q-card class="q-pa-md">
            <!-- Barra de Ferramentas -->
            <div class="row q-col-gutter-md q-mb-md">
              <!-- Campo de Busca -->
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="searchText"
                  outlined
                  dense
                  placeholder="Buscar por cliente..."
                  @update:model-value="filterReservas"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      v-if="searchText"
                      name="clear"
                      class="cursor-pointer"
                      @click="clearSearch"
                    />
                  </template>
                </q-input>
              </div>
  
              <!-- Ordenação -->
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="sortOrder"
                  :options="sortOptions"
                  outlined
                  dense
                  emit-value
                  map-options
                  label="Ordenar por"
                  @update:model-value="sortReservas"
                >
                  <template v-slot:prepend>
                    <q-icon name="sort" />
                  </template>
                </q-select>
              </div>
            </div>
  
            <!-- Tabela de Reservas -->
            <q-table
              :rows="filteredReservas"
              :columns="columns"
              row-key="reservaId"
              :loading="loading"
              :filter="searchText"
              no-data-label="Nenhuma reserva encontrada"
              no-results-label="Nenhum resultado encontrado"
              loading-label="Carregando..."
            >
              <!-- Slot para formatar a data -->
              <template v-slot:body-cell-dataReserva="props">
                <q-td :props="props">
                  {{ formatDate(props.value) }}
                </q-td>
              </template>
  
              <!-- Slot para formatar o valor -->
              <template v-slot:body-cell-custoTotal="props">
                <q-td :props="props">
                    {{ formatCurrency(props.row.custoTotal) }}
                    <!-- Debug output -->
                    <small v-if="false">Raw: {{ props.row.custoTotal }}</small>
                </q-td>
            </template>
  
              <!-- Slot para status de pagamento -->
              <template v-slot:body-cell-statusPagamento="props">
                <q-td :props="props">
                  <q-chip
                    :color="props.value === 'Pago' ? 'positive' : 'warning'"
                    text-color="white"
                    dense
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
              </template>
  
              <!-- Slot para ações -->
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn-group flat>
                    <q-btn
                      flat
                      round
                      color="primary"
                      icon="visibility"
                      @click="showDetails(props.row)"
                    >
                      <q-tooltip>Detalhes</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="negative"
                      icon="delete"
                      @click="confirmDelete(props.row)"
                    >
                      <q-tooltip>Excluir</q-tooltip>
                    </q-btn>
                  </q-btn-group>
                </q-td>
              </template>
            </q-table>
          </q-card>
  
          <!-- Dialog de Detalhes -->
          <q-dialog v-model="detailsDialog" persistent>
            <q-card style="min-width: 600px">
              <q-card-section class="row items-center">
                <div class="text-h6">Detalhes da Reserva</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
              </q-card-section>
  
              <q-card-section>
                <div class="row q-col-gutter-md">
                  <!-- Informações da Reserva -->
                  <div class="col-12">
                    <div class="text-subtitle1 q-mb-sm">Informações da Reserva</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="detailsForm.cliente"
                          label="Cliente"
                          readonly
                          dense
                          outlined
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="detailsForm.dataReserva"
                          label="Data da Reserva"
                          readonly
                          dense
                          outlined
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-select
                          v-model="detailsForm.statusPagamento"
                          :options="['Pendente', 'Pago']"
                          label="Status do Pagamento"
                          dense
                          outlined
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="detailsForm.metodoPagamento"
                          label="Método de Pagamento"
                          readonly
                          dense
                          outlined
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="detailsForm.custoTotal"
                          label="Custo Total"
                          readonly
                          dense
                          outlined
                        />
                      </div>
                    </div>
                  </div>
  
                  <!-- Informações da Viagem -->
                  <div class="col-12">
                    <div class="text-subtitle1 q-mb-sm">Informações da Viagem</div>
                    <div class="row q-col-gutter-md">
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="detailsForm.destino"
                          label="Destino"
                          readonly
                          dense
                          outlined
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="detailsForm.dataPartida"
                          label="Data de Partida"
                          readonly
                          dense
                          outlined
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-input
                          v-model="detailsForm.dataRetorno"
                          label="Data de Retorno"
                          readonly
                          dense
                          outlined
                        />
                      </div>
                      <div class="col-12 col-sm-6">
                        <q-select
                          v-model="detailsForm.status"
                          :options="['Pendente', 'Cancelado', 'Concluído']"
                          label="Status da Viagem"
                          dense
                          outlined
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
  
              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" v-close-popup />
                <q-btn flat label="Salvar" color="positive" @click="updateReserva" />
              </q-card-actions>
            </q-card>
          </q-dialog>
  
          <!-- Dialog de Confirmação de Exclusão -->
          <q-dialog v-model="deleteDialog" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="warning" color="warning" text-color="white" />
                <span class="q-ml-sm">Você tem certeza que deseja excluir esta reserva?</span>
              </q-card-section>
  
              <q-card-actions align="right">
                <q-btn flat label="Cancelar" color="primary" v-close-popup />
                <q-btn
                  flat
                  label="Excluir"
                  color="negative"
                  @click="deleteReserva"
                  v-close-popup
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
</template>
  
<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useReservaStore } from '../../controller/store/ReservaStore'

export default {
    setup() {
    const $q = useQuasar()
    const reservaStore = useReservaStore()
    const loading = ref(false)
    const searchText = ref('')
    const deleteDialog = ref(false)
    const detailsDialog = ref(false)
    const selectedReserva = ref(null)
    const sortOrder = ref('dataReserva-desc')

    // Opções de ordenação
    const sortOptions = [
        { label: 'Data (Mais Recente)', value: 'dataReserva-desc' },
        { label: 'Data (Mais Antiga)', value: 'dataReserva-asc' },
        { label: 'Cliente (A-Z)', value: 'cliente-asc' },
        { label: 'Cliente (Z-A)', value: 'cliente-desc' },
        { label: 'Valor (Maior-Menor)', value: 'valor-desc' },
        { label: 'Valor (Menor-Maior)', value: 'valor-asc' },
    ]

    // Definição das colunas da tabela
    const columns = [
    {
        name: 'cliente',
        required: true,
        label: 'Cliente',
        align: 'left',
        field: row => row.cliente?.nome || 'N/A',
        sortable: true,
    },
    {
        name: 'dataReserva',
        required: true,
        label: 'Data da Reserva',
        align: 'left',
        field: 'dataReserva', // Changed from incorrect mapping
        format: (val) => formatDate(val),
        sortable: true,
    },
    {
        name: 'destino',
        required: true,
        label: 'Destino',
        align: 'left',
        field: row => row.viagem?.destino?.localizacao || 'N/A',
        sortable: true,
    },
    {
        name: 'statusPagamento',
        required: true,
        label: 'Status do Pagamento',
        align: 'center',
        field: 'statusPagamento',
        sortable: true,
    },
    {
        name: 'custoTotal',
        required: true,
        label: 'Valor Total',
        align: 'right',
        field: row => row.custoTotal,
        format: val => formatCurrency(val),
        sortable: true
    },
    {
        name: 'actions',
        required: true,
        label: 'Ações',
        align: 'center',
        field: 'actions',
    },
    ]

    const detailsForm = ref({
        reservaId: null,
        cliente: '',
        dataReserva: '',
        statusPagamento: '',
        metodoPagamento: '',
        custoTotal: '',
        destino: '',
        dataPartida: '',
        dataRetorno: '',
        status: ''
    })

    // Carregar reservas ao montar o componente
    onMounted(async () => {
        await fetchReservas()
    })

    // Buscar reservas
    const fetchReservas = async () => {
    loading.value = true
    try {
        await reservaStore.fetch()
    } catch (error) {
        console.error('Erro ao carregar reservas:', error)
        $q.notify({
            type: 'negative',
            message: 'Erro ao carregar reservas',
            caption: error.message || 'Erro ao comunicar com o servidor',
            position: 'top',
        })
    } finally {
        loading.value = false
    }
}

    // Filtrar e ordenar reservas
    const filteredReservas = computed(() => {
      let reservas = [...(reservaStore.items || [])]

      if (searchText.value) {
          const searchLower = searchText.value.toLowerCase()
          reservas = reservas.filter(
              (reserva) => reserva.cliente?.nome?.toLowerCase().includes(searchLower)
          )
      }

      // Aplicar ordenação
      switch (sortOrder.value) {
        case 'dataReserva-desc':
            reservas.sort((a, b) => new Date(b.dataReserva) - new Date(a.dataReserva))
            break
        case 'dataReserva-asc':
            reservas.sort((a, b) => new Date(a.dataReserva) - new Date(b.dataReserva))
            break
        case 'cliente-asc':
            reservas.sort((a, b) => a.cliente?.nome?.localeCompare(b.cliente?.nome))
            break
        case 'cliente-desc':
            reservas.sort((a, b) => b.cliente?.nome?.localeCompare(a.cliente?.nome))
            break
        case 'valor-desc':
            reservas.sort((a, b) => b.custoTotal - a.custoTotal)
            break
        case 'valor-asc':
            reservas.sort((a, b) => a.custoTotal - b.custoTotal)
            break
        }

        return reservas
    })

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        }).format(value)
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR')
    }

    const clearSearch = () => {
        searchText.value = ''
    }

    const showDetails = (reserva) => {
        selectedReserva.value = JSON.parse(JSON.stringify(reserva))
        detailsForm.value = {
            reservaId: reserva.reservaId,
            cliente: reserva.cliente?.nome || 'N/A',
            dataReserva: formatDate(reserva.dataReserva),
            statusPagamento: reserva.statusPagamento,
            metodoPagamento: reserva.metodoPagamento,
            custoTotal: formatCurrency(reserva.custoTotal),
            destino: reserva.viagem?.destino?.localizacao || 'N/A',
            dataPartida: formatDate(reserva.viagem?.dataPartida),
            dataRetorno: formatDate(reserva.viagem?.dataRetorno),
            status: reserva.viagem?.status
        }
        detailsDialog.value = true
    }

    const updateReserva = async () => {
      try {
        loading.value = true
        
        // Ensure we have all the required data from the selected reservation
        const updateData = {
          reservaId: selectedReserva.value.reservaId,
          clienteId: selectedReserva.value.clienteId,
          viagemId: selectedReserva.value.viagemId,
          dataReserva: selectedReserva.value.dataReserva,
          statusPagamento: detailsForm.value.statusPagamento,
          metodoPagamento: selectedReserva.value.metodoPagamento,
          custoTotal: selectedReserva.value.custoTotal,
          duracaoDias: selectedReserva.value.duracaoDias || 0,
          // Add the viagem object
          viagem: {
            id: selectedReserva.value.viagemId,
            destinoId: selectedReserva.value.viagem.destino.destinoId,
            status: detailsForm.value.status,
            dataPartida: selectedReserva.value.viagem.dataPartida,
            dataRetorno: selectedReserva.value.viagem.dataRetorno
          }
        }

        console.log('Dados para atualização:', updateData) // Debug log

        const result = await reservaStore.updateItem(updateData.reservaId, updateData)
        
        if (result) {
          $q.notify({
            type: 'positive',
            message: 'Reserva atualizada com sucesso!'
          })
          detailsDialog.value = false
          await fetchReservas()
        }
      } catch (error) {
        console.error('Erro ao atualizar reserva:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao atualizar reserva',
          caption: error.message || 'Verifique os dados e tente novamente'
        })
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = (reserva) => {
      selectedReserva.value = reserva
      deleteDialog.value = true
    }

    const deleteReserva = async () => {
      try {
        loading.value = true
        await reservaStore.deleteItem(selectedReserva.value.reservaId)
        $q.notify({
          type: 'positive',
          message: 'Reserva excluída com sucesso!'
        })
        await fetchReservas() // Recarrega a lista após excluir
      } catch (error) {
        console.error('Erro ao excluir reserva:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao excluir reserva',
          caption: error.message || 'Ocorreu um erro inesperado'
        })
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      searchText,
      sortOrder,
      sortOptions,
      columns,
      filteredReservas,
      deleteDialog,
      detailsDialog,
      detailsForm,
      formatCurrency,
      formatDate,
      clearSearch,
      showDetails,
      updateReserva,
      confirmDelete,
      deleteReserva,
      reservas: computed(() => reservaStore.items)
    }
  },
}
</script>

<style scoped>
.reservas-page {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>