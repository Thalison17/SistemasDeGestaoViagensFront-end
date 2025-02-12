<template>
    <div class="reserva-page q-pa-md">
      <div class="text-center q-mb-lg">
        <h1 class="text-h3 text-weight-bold text-primary">Cadastro de Reserva</h1>
        <p class="text-subtitle1">Preencha os dados para cadastrar uma nova reserva</p>
      </div>
  
      <div class="row justify-center">
        <div class="col-12 col-sm-8 col-md-6">
          <q-card class="q-pa-md">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <!-- Cliente Select -->
              <q-select
                v-model="formData.clienteId"
                :options="clientes"
                option-value="clienteId"
                option-label="nome"
                label="Cliente *"
                :rules="[(val) => !!val || 'Cliente é obrigatório']"
                emit-value
                map-options
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="person" />
                </template>
              </q-select>
  
              <!-- Destino Select -->
              <q-select
                v-model="formData.viagem.destinoId"
                :options="destinos"
                option-value="destinoId"
                option-label="localizacao"
                label="Destino *"
                :rules="[(val) => !!val || 'Destino é obrigatório']"
                emit-value
                map-options
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="place" />
                </template>
              </q-select>
  
              <!-- Data Partida -->
              <q-input
                v-model="formData.viagem.dataPartida"
                label="Data de Partida *"
                type="date"
                :rules="[(val) => !!val || 'Data de partida é obrigatória']"
                lazy-rules
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="flight_takeoff" />
                </template>
              </q-input>
  
              <!-- Data Retorno -->
              <q-input
                v-model="formData.viagem.dataRetorno"
                label="Data de Retorno *"
                type="date"
                :rules="[
                  (val) => !!val || 'Data de retorno é obrigatória',
                  (val) => isValidDateRange() || 'Data de retorno deve ser posterior à data de partida'
                ]"
                lazy-rules
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="flight_land" />
                </template>
              </q-input>
  
              <!-- Método de Pagamento -->
              <q-select
                v-model="formData.metodoPagamento"
                :options="metodosPagamento"
                label="Método de Pagamento *"
                :rules="[(val) => !!val || 'Método de pagamento é obrigatório']"
                lazy-rules
                outlined
              >
                <template v-slot:prepend>
                  <q-icon name="payment" />
                </template>
              </q-select>
  
              <!-- Data da Reserva é preenchida automaticamente -->
  
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
  import { useReservaStore } from '../../controller/store/ReservaStore'
  import { useClienteStore } from '../../controller/store/ClienteStore'
  import { useDestinoStore } from '../../controller/store/DestinoStore'
  
  export default {
    setup() {
      const $q = useQuasar()
      const loading = ref(false)
      const reservaStore = useReservaStore()
      const clienteStore = useClienteStore()
      const destinoStore = useDestinoStore()
  
      const clientes = ref([])
      const destinos = ref([])
  
      const metodosPagamento = [
        'Cartão de Crédito',
        'Cartão de Débito',
        'PIX',
        'Boleto',
        'Dinheiro'
      ]
  
      const formData = ref({
        clienteId: null,
        dataReserva: new Date().toISOString(),
        statusPagamento: 'Pendente',
        metodoPagamento: null,
        viagem: {
          destinoId: null,
          dataPartida: '',
          dataRetorno: '',
          status: 'Pendente'
        }
      })
  
      onMounted(async () => {
        try {
          await Promise.all([
            clienteStore.fetch(),
            destinoStore.fetch()
          ])
          clientes.value = clienteStore.items
          destinos.value = destinoStore.items
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Erro ao carregar dados',
            caption: error.message,
            position: 'top'
          })
        }
      })
  
      const isValidDateRange = () => {
        if (!formData.value.viagem.dataPartida || !formData.value.viagem.dataRetorno) {
          return true
        }
        return new Date(formData.value.viagem.dataRetorno) > new Date(formData.value.viagem.dataPartida)
      }
  
      const onSubmit = async () => {
        try {
          loading.value = true
  
          // Atualiza a data da reserva para o momento atual
          formData.value.dataReserva = new Date().toISOString()
  
          await reservaStore.save(formData.value)
  
          $q.notify({
            type: 'positive',
            message: 'Reserva cadastrada com sucesso!',
            position: 'top',
            timeout: 2500,
            actions: [
              { label: 'Fechar', color: 'white' }
            ]
          })
  
          resetForm()
  
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Erro ao cadastrar reserva',
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
          clienteId: null,
          dataReserva: new Date().toISOString(),
          statusPagamento: 'Pendente',
          metodoPagamento: null,
          viagem: {
            destinoId: null,
            dataPartida: '',
            dataRetorno: '',
            status: 'Pendente'
          }
        }
      }
  
      return {
        formData,
        loading,
        onSubmit,
        resetForm,
        clientes,
        destinos,
        metodosPagamento,
        isValidDateRange
      }
    }
  }
  </script>
  
  <style scoped>
  .reserva-page {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .q-card {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  }
  </style>
