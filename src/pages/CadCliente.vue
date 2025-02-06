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
                val => !!val || 'Nome é obrigatório',
                val => val.length >= 3 || 'Nome deve ter no mínimo 3 caracteres'
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
                val => !!val || 'Email é obrigatório',
                val => isValidEmail(val) || 'Email inválido'
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
                val => !!val || 'Telefone é obrigatório',
                val => val.length >= 14 || 'Telefone inválido'
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
                val => !!val || 'CPF é obrigatório',
                val => isValidCPF(val) || 'CPF inválido'
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
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useClienteStore } from '../controller/store/ClienteStore'; // Ajuste o caminho se necessário
import Cliente from '../model/Cliente';

export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const loading = ref(false);
    const clienteStore = useClienteStore(); // Chame a função para obter a store

    const formData = ref({
      nome: '',
      email: '',
      telefone: '',
      cpf: ''
    });

    // Validação de email
    const isValidEmail = (val) => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailPattern.test(val);
    };

    // Validação de CPF
    const isValidCPF = (cpf) => {
      cpf = cpf.replace(/[^\d]+/g, '');
      if (cpf.length !== 11) return false;

      // Elimina CPFs inválidos conhecidos
      if (/^(\d)\1{10}$/.test(cpf)) return false;

      // Valida 1o dígito
      let add = 0;
      for (let i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(9))) return false;

      // Valida 2o dígito
      add = 0;
      for (let i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
      }
      rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(10))) return false;

      return true;
    };

    const onSubmit = async () => {
      try {
        loading.value = true;

        // Cria uma nova instância de Cliente com os dados do formulário
        const novoCliente = new Cliente(
          null, // clienteId será gerado pelo backend
          formData.value.nome,
          formData.value.email,
          formData.value.telefone,
          formData.value.cpf
        );

        // Usa o store para salvar o cliente
        await clienteStore.save(novoCliente);

        // Mostra mensagem de sucesso
        $q.notify({
          type: 'positive',
          message: 'Cliente cadastrado com sucesso!'
        });

        // Redireciona para a página apropriada
        router.push('/');

      } catch (error) {
        // Trata os erros
        $q.notify({
          type: 'negative',
          message: error.message || 'Erro ao cadastrar cliente'
        });
      } finally {
        loading.value = false;
      }
    };

    const resetForm = () => {
      formData.value = {
        nome: '',
        email: '',
        telefone: '',
        cpf: ''
      };
    };

    return {
      formData,
      loading,
      onSubmit,
      resetForm,
      isValidEmail,
      isValidCPF
    };
  }
};
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
