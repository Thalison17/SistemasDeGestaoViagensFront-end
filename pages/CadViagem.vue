<template>
  <div class="viagem-page q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Cadastro de Viagem</h1>
      <p class="text-subtitle1">Preencha os dados para criar uma nova viagem</p>
    </div>

    <!-- Formulário de Cadastro -->
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">
        <q-card class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <!-- Destino -->
            <q-select
              v-model="formData.destinoId"
              :options="destinos"
              label="Destino *"
              option-label="nome"
              option-value="destinoId"
              :rules="[(val) => !!val || 'Destino é obrigatório']"
              outlined
            />

            <!-- Data de Partida -->
            <q-input
              v-model="formData.dataPartida"
              label="Data de Partida *"
              type="date"
              :rules="[(val) => !!val || 'Data de Partida é obrigatória']"
              outlined
            />

            <!-- Data de Retorno -->
            <q-input
              v-model="formData.dataRetorno"
              label="Data de Retorno *"
              type="date"
              :rules="[(val) => !!val || 'Data de Retorno é obrigatória']"
              outlined
            />

            <!-- Cliente -->
            <q-select
              v-model="formData.cliente"
              :options="clientes"
              label="Cliente *"
              option-label="nome"
              option-value="clienteId"
              :rules="[(val) => !!val || 'Cliente é obrigatório']"
              outlined
            />

            <!-- Botões -->
            <div class="row q-gutter-sm justify-end">
              <q-btn
                label="Limpar"
                type="reset"
                color="negative"
                flat
                class="q-mt-lg"
                @click="resetForm"
              />
              <q-btn
                label="Cadastrar"
                type="submit"
                color="primary"
                class="q-mt-lg"
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useViagemStore } from '../controller/store/ViagemStore'
import { useDestinoStore } from '../controller/store/DestinoStore'
import { useClienteStore } from '../controller/store/ClienteStore'
import Viagem from '../model/Viagem'
import DestinoController from "src/controller/DestinoController.js"
import ClienteController from "src/controller/ClienteController.js"

export default {
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const viagemStore = useViagemStore()
    const destinoStore = useDestinoStore()
    const clienteStore = useClienteStore()

    const formData = ref({
      destinoId: null,
      dataPartida: '',
      dataRetorno: '',
      cliente: null,
    })

    const destinos = ref([])
    const clientes = ref([])

    // Carrega os destinos e clientes ao montar o componente
    onMounted(async () => {
      try {
        destinos.value = await new DestinoController().getAll();
        clientes.value = await new ClienteController().getAll();
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar dados',
          caption: error.message || 'Ocorreu um erro inesperado',
          position: 'top',
          timeout: 3000,
          actions: [{ label: 'Fechar', color: 'white' }],
        })
      }
    })

    const onSubmit = async () => {
      try {
        loading.value = true

        // Cria uma nova instância de Viagem com os dados do formulário
        const novaViagem = new Viagem(
          null, // viagemId será gerado pelo backend
          formData.value.destinoId,
          formData.value.dataPartida,
          formData.value.dataRetorno,
          formData.value.cliente,
          destinos.value.find((d) => d.destinoId === formData.value.destinoId) // Busca o destino completo
        )

        // Usa o store para salvar a viagem
        await viagemStore.save(novaViagem)

        // Mostra mensagem de sucesso
        $q.notify({
          type: 'positive',
          message: 'Viagem cadastrada com sucesso!',
          position: 'top',
          timeout: 2500,
          actions: [{ label: 'Fechar', color: 'white' }],
        })

        resetForm()
      } catch (error) {
        // Trata os erros
        $q.notify({
          type: 'negative',
          message: 'Erro ao cadastrar viagem',
          caption: error.message || 'Ocorreu um erro inesperado',
          position: 'top',
          timeout: 3000,
          actions: [{ label: 'Fechar', color: 'white' }],
        })
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      formData.value = {
        destinoId: null,
        dataPartida: '',
        dataRetorno: '',
        cliente: null,
      }
    }

    return {
      formData,
      destinos,
      clientes,
      loading,
      onSubmit,
      resetForm,
    }
  },
}
</script>

<style scoped>
.viagem-page {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
