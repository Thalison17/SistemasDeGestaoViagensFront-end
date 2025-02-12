<template>
  <div class="client-page q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Cadastro de Cliente</h1>
      <p class="text-subtitle1">Preencha os dados para criar seu cadastro</p>
    </div>

    <!-- Formulário de Cadastro -->
    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6">
        <q-card class="q-pa-md">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <!-- Nome -->
            <q-input
              v-model="formData.nome"
              label="Nome completo *"
              :rules="[
                (val) => !!val || 'Nome é obrigatório',
                (val) => val.length >= 3 || 'Nome deve ter no mínimo 3 caracteres',
              ]"
              lazy-rules
              outlined
            />

            <!-- Email -->
            <q-input
              v-model="formData.email"
              label="Email *"
              type="email"
              :rules="[
                (val) => !!val || 'Email é obrigatório',
                (val) => isEmail(val) || 'Email inválido',
              ]"
              lazy-rules
              outlined
            />

            <!-- Telefone -->
            <q-input
              v-model="formData.telefone"
              label="Telefone *"
              mask="(##) #####-####"
              :rules="[
                (val) => !!val || 'Telefone é obrigatório',
                (val) => val.length >= 14 || 'Telefone inválido',
              ]"
              lazy-rules
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>

            <!-- CPF -->
            <q-input
              v-model="formData.cpf"
              label="CPF *"
              mask="###.###.###-##"
              :rules="[
                (val) => !!val || 'CPF é obrigatório',
                (val) => isCPF(val) || 'CPF inválido',
              ]"
              lazy-rules
              outlined
            >
              <template v-slot:prepend>
                <q-icon name="badge" />
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
import { useClienteStore } from '../controller/store/ClienteStore'
import Cliente from '../model/Cliente'

export default {
  setup() {
    const $q = useQuasar()
    const loading = ref(false)
    const clienteStore = useClienteStore()

    const formData = ref({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
    })

    const isEmail = (val) => {
      const emailPattern =
        /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val)
    }

    const isCPF = (val) => {
      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
      if (!cpfPattern.test(val)) {
        return 'Digite um CPF válido'
      }

      // validação de CPF
      let sum
      let remainder
      sum = 0
      if (
        val === '000.000.000-00' ||
        val === '111.111.111-11' ||
        val === '222.222.222-22' ||
        val === '333.333.333-33' ||
        val === '444.444.444-44' ||
        val === '555.555.555-55' ||
        val === '666.666.666-66' ||
        val === '777.777.777-77' ||
        val === '888.888.888-88' ||
        val === '999.999.999-99'
      ) {
        return 'Digite um CPF válido'
      }
      const cpfNumbers = val.replace(/[^\d]+/g, '')
      for (let i = 1; i <= 9; i++) {
        sum = sum + parseInt(cpfNumbers.substring(i - 1, i)) * (11 - i)
      }
      remainder = (sum * 10) % 11
      if (remainder === 10 || remainder === 11) remainder = 0
      if (remainder !== parseInt(cpfNumbers.substring(9, 10))) return 'Digite um CPF válido'
      sum = 0
      for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpfNumbers.substring(i - 1, i)) * (12 - i)
      remainder = (sum * 10) % 11
      if (remainder === 10 || remainder === 11) remainder = 0
      if (remainder !== parseInt(cpfNumbers.substring(10, 11))) return 'Digite um CPF válido'
      return true
    }

    const onSubmit = async () => {
      try {
        loading.value = true

        // Cria uma nova instância de Cliente com os dados do formulário
        const novoCliente = new Cliente(
          null, // clienteId será gerado pelo backend
          formData.value.nome,
          formData.value.email,
          formData.value.telefone,
          formData.value.cpf,
        )

        // Usa o store para salvar o cliente
        await clienteStore.save(novoCliente)

        // Mostra mensagem de sucesso
        $q.notify({
          type: 'positive',
          message: 'Cliente cadastrado com sucesso!',
          caption: `${formData.value.nome}, ${formData.value.cpf}`,
          position: 'top',
          timeout: 2500,
          actions: [{ label: 'Fechar', color: 'white' }],
        })

        resetForm()
      } catch (error) {
        // Trata os erros
        $q.notify({
          type: 'negative',
          message: 'Erro ao cadastrar cliente',
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
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
      }
    }

    return {
      formData,
      loading,
      onSubmit,
      resetForm,
      isEmail,
      isCPF,
    }
  },
}
</script>

<style scoped>
.client-page {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
