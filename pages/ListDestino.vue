<template>
  <div class="destinos-page q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Destinos Disponíveis</h1>
      <p class="text-subtitle1">Confira nossos destinos cadastrados</p>
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
                placeholder="Buscar por localização..."
                @update:model-value="filterDestinos"
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
                @update:model-value="sortDestinos"
              >
                <template v-slot:prepend>
                  <q-icon name="sort" />
                </template>
              </q-select>
            </div>
          </div>

          <!-- Tabela de Destinos -->
          <q-table
            :rows="filteredDestinos"
            :columns="columns"
            row-key="destinoId"
            :loading="loading"
            :filter="searchText"
            no-data-label="Nenhum destino encontrado"
            no-results-label="Nenhum resultado encontrado"
            loading-label="Carregando..."
          >
            <!-- Slot para formatar o preço -->
            <template v-slot:body-cell-precoPorDia="props">
              <q-td :props="props">
                {{ formatCurrency(props.value) }}
              </q-td>
            </template>

            <!-- Slot para ações -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn-group flat>
                  <q-btn flat round color="primary" icon="edit" @click="editDestino(props.row)">
                    <q-tooltip>Editar</q-tooltip>
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
        <q-dialog v-model="editDialog">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Editar Destino</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input v-model="editForm.localizacao" label="Localização" readonly dense outlined />
              <q-input
                v-model="editForm.pais"
                label="País"
                readonly
                dense
                outlined
                class="q-mt-md"
              />
              <q-input
                v-model.number="editForm.precoPorDia"
                label="Preço por Dia"
                type="number"
                dense
                outlined
                class="q-mt-md"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn flat label="Salvar" color="positive" @click="updateDestino" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>

    <!-- Diálogo de Confirmação de Exclusão -->
    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="warning" color="warning" text-color="white" />
          <span class="q-ml-sm">Você tem certeza que deseja excluir este destino?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Excluir" color="negative" @click="deleteDestino" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useDestinoStore } from '../controller/store/DestinoStore'

export default {
  setup() {
    const $q = useQuasar()
    const destinoStore = useDestinoStore()
    const loading = ref(false)
    const searchText = ref('')
    const deleteDialog = ref(false)
    const selectedDestino = ref(null)
    const sortOrder = ref('localizacao-asc')

    // Opções de ordenação
    const sortOptions = [
      { label: 'Localização (A-Z)', value: 'localizacao-asc' },
      { label: 'Localização (Z-A)', value: 'localizacao-desc' },
      { label: 'Preço (Menor-Maior)', value: 'preco-asc' },
      { label: 'Preço (Maior-Menor)', value: 'preco-desc' },
    ]

    // Definição das colunas da tabela
    const columns = [
      {
        name: 'localizacao',
        required: true,
        label: 'Localização',
        align: 'left',
        field: 'localizacao',
        sortable: true,
      },
      {
        name: 'pais',
        required: true,
        label: 'País',
        align: 'left',
        field: 'pais',
        sortable: true,
      },
      {
        name: 'precoPorDia',
        required: true,
        label: 'Preço por Dia',
        align: 'right',
        field: 'precoPorDia',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Ações',
        align: 'center',
        field: 'actions',
      },
    ]

    // Carregar destinos ao montar o componente
    onMounted(async () => {
      await fetchDestinos()
    })

    // Buscar destinos
    const fetchDestinos = async () => {
      loading.value = true
      try {
        await destinoStore.fetch()
        console.log('Destinos carregados:', destinoStore.items)
      } catch (error) {
        console.error('Erro ao carregar destinos:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar destinos',
          caption: error.message || 'Ocorreu um erro inesperado',
          position: 'top',
          timeout: 5000,
        })
      } finally {
        loading.value = false
      }
    }

    // Filtrar e ordenar destinos
    const filteredDestinos = computed(() => {
      let destinos = destinoStore.items || []
      console.log('Destinos no filtro:', destinos) // Debug

      if (searchText.value) {
        const searchLower = searchText.value.toLowerCase()
        destinos = destinos.filter(
          (destino) =>
            destino.localizacao?.toLowerCase().includes(searchLower) ||
            destino.pais?.toLowerCase().includes(searchLower),
        )
      }

      // Aplicar ordenação
      switch (sortOrder.value) {
        case 'localizacao-asc':
          destinos.sort((a, b) => a.localizacao.localeCompare(b.localizacao))
          break
        case 'localizacao-desc':
          destinos.sort((a, b) => b.localizacao.localeCompare(a.localizacao))
          break
        case 'preco-asc':
          destinos.sort((a, b) => a.precoPorDia - b.precoPorDia)
          break
        case 'preco-desc':
          destinos.sort((a, b) => b.precoPorDia - a.precoPorDia)
          break
      }

      return destinos
    })

    const formatCurrency = (value) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)
    }

    const clearSearch = () => {
      searchText.value = ''
    }

    const editDialog = ref(false)
    const editForm = ref({
      destinoId: null,
      localizacao: '',
      pais: '',
      precoPorDia: 0,
    })

    const editDestino = (destino) => {
      editForm.value = {
        destinoId: destino.destinoId,
        localizacao: destino.localizacao,
        pais: destino.pais,
        precoPorDia: destino.precoPorDia,
      }
      editDialog.value = true
    }

    const updateDestino = async () => {
      try {
        loading.value = true
        const updateData = {
          destinoId: editForm.value.destinoId,
          localizacao: editForm.value.localizacao,
          pais: editForm.value.pais,
          precoPorDia: Number(editForm.value.precoPorDia),
        }

        await destinoStore.updateItem(updateData.destinoId, updateData)

        $q.notify({
          type: 'positive',
          message: 'Destino atualizado com sucesso!',
        })

        editDialog.value = false
        await fetchDestinos() // Recarrega a lista
      } catch (error) {
        console.error('Erro ao atualizar destino:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao atualizar destino',
          caption: error.message || 'Ocorreu um erro inesperado',
        })
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = (destino) => {
      selectedDestino.value = destino
      deleteDialog.value = true
    }

    const deleteDestino = async () => {
      try {
        await destinoStore.deleteItem(selectedDestino.value.destinoId)
        $q.notify({
          type: 'positive',
          message: 'Destino excluído com sucesso!',
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao excluir destino',
          caption: error.message,
        })
      }
    }

    return {
      loading,
      searchText,
      sortOrder,
      sortOptions,
      columns,
      filteredDestinos,
      deleteDialog,
      formatCurrency,
      clearSearch,
      editDestino,
      editDialog,
      editForm,
      updateDestino,
      confirmDelete,
      deleteDestino,
      destinos: computed(() => destinoStore.items),
    }
  },
}
</script>

<style scoped>
.destinos-page {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
