<template>
  <div class="destino-page q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Cadastro de Destino</h1>
      <p class="text-subtitle1">Preencha os dados para cadastrar um novo destino</p>
    </div>

    <!-- Formulário de Cadastro -->
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">
        <q-card class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-md">

            <!-- Localização -->
            <q-input
              v-model="formData.localizacao"
              label="Localização *"
              :rules="[
                (val) => !!val || 'Localização é obrigatória',
                (val) => val.length >= 3 || 'Localização deve ter no mínimo 3 caracteres',
              ]"
              lazy-rules
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="location_on" />
              </template>
            </q-input>

            <!-- País -->
            <q-input
              v-model="formData.pais"
              label="País *"
              :rules="[
                (val) => !!val || 'País é obrigatório',
                (val) => val.length >= 3 || 'País deve ter no mínimo 3 caracteres',
              ]"
              lazy-rules
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="public" />
              </template>
            </q-input>

            <!-- Preço por Dia -->
            <q-input
              v-model="formData.precoPorDia"
              label="Preço por Dia *"
              type="number"
              prefix="R$"
              :rules="[
                (val) => !!val || 'Preço por dia é obrigatório',
                (val) => val > 0 || 'Preço deve ser maior que zero',
              ]"
              lazy-rules
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="paid" />
              </template>
            </q-input>

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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useDestinoStore } from '../../controller/store/DestinoStore'
import Destino from '../../model/Destino'

export default {
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const destinoStore = useDestinoStore()

    const formData = ref({
      localizacao: '',
      pais: '',
      precoPorDia: null,
    })

    const onSubmit = async () => {
      try {
        loading.value = true

        // Cria uma nova instância de Destino com os dados do formulário
        const novoDestino = new Destino(
          null, // destinoId será gerado pelo backend
          formData.value.localizacao,
          formData.value.pais,
          parseFloat(formData.value.precoPorDia)
        )

        // Usa o store para salvar o destino
        await destinoStore.save(novoDestino)

        // Mostra notificação de sucesso com mais detalhes e duração maior
        $q.notify({
          type: 'positive',
          message: 'Destino cadastrado com sucesso!',
          caption: `${formData.value.localizacao}, ${formData.value.pais}`,
          position: 'top',
          timeout: 2500,
          actions: [
            { label: 'Fechar', color: 'white' }
          ]
        })

        // Limpa o formulário após sucesso
        resetForm()

      } catch (error) {
        // Mostra notificação de erro com mais detalhes
        $q.notify({
          type: 'negative',
          message: 'Erro ao cadastrar destino',
          caption: error.message || 'Ocorreu um erro inesperado',
          position: 'top',
          timeout: 3000,
          actions: [
            { label: 'Fechar', color: 'white' }
          ]
        })
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      formData.value = {
        localizacao: '',
        pais: '',
        precoPorDia: null,
      }
    }

    return {
      formData,
      loading,
      onSubmit,
      resetForm,
    }
  },
}
</script>

<style scoped>
.destino-page {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
