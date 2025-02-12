<template>
  <div class="viagem-list-page q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Lista de Viagens</h1>
    </div>

    <!-- Tabela de Viagens -->
    <q-table
      :rows="viagens"
      :columns="columns"
      row-key="viagemId"
      :loading="loading"
      :pagination="pagination"
    >
      <!-- Coluna de Ações -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            icon="edit"
            color="primary"
            flat
            @click="editarViagem(props.row.viagemId)"
          />
          <q-btn
            icon="delete"
            color="negative"
            flat
            @click="excluirViagem(props.row.viagemId)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useViagemStore } from '../controller/store/ViagemStore'
import ViagemController from "src/controller/ViagemController.js";
//import router from

export default {
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const viagemStore = useViagemStore()
    const viagens = ref([])

    const columns = [
      { name: 'viagemId', label: 'ID', field: 'viagemId', align: 'left' },
      { name: 'destino', label: 'Destino', field: (row) => row.destino.nome, align: 'left' },
      { name: 'dataPartida', label: 'Data de Partida', field: 'dataPartida', align: 'left' },
      { name: 'dataRetorno', label: 'Data de Retorno', field: 'dataRetorno', align: 'left' },
      { name: 'cliente', label: 'Cliente', field: (row) => row.cliente.nome, align: 'left' },
      { name: 'status', label: 'Status', field: 'status', align: 'left' },
      { name: 'actions', label: 'Ações', align: 'center' },
    ]

    const pagination = {
      rowsPerPage: 10,
    }

    // Carrega as viagens ao montar o componente
    onMounted(async () => {
      try {
        loading.value = true
        viagens.value = await new ViagemController().getAllViagens()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar viagens',
          caption: error.message || 'Ocorreu um erro inesperado',
          position: 'top',
          timeout: 3000,
          actions: [{ label: 'Fechar', color: 'white' }],
        })
      } finally {
        loading.value = false
      }
    })

    //const editarViagem = (viagemId) => {
      // Redireciona para a tela de edição
      //router.push({ name: 'EditarViagem', params: { id: viagemId } })
   // }

    const excluirViagem = async (viagemId) => {
      try {
        await viagemStore.excluirViagem(viagemId)
        viagens.value = viagens.value.filter((v) => v.viagemId !== viagemId)
        $q.notify({
          type: 'positive',
          message: 'Viagem excluída com sucesso!',
          position: 'top',
          timeout: 2500,
          actions: [{ label: 'Fechar', color: 'white' }],
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao excluir viagem',
          caption: error.message || 'Ocorreu um erro inesperado',
          position: 'top',
          timeout: 3000,
          actions: [{ label: 'Fechar', color: 'white' }],
        })
      }
    }

    return {
      viagens,
      columns,
      pagination,
      loading,
     // editarViagem,
      excluirViagem,
    }
  },
}
</script>

<style scoped>
.viagem-list-page {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
