<template>
  <div class="clientes-page q-pa-md">
    <div class="text-center q-mb-lg">
      <h1 class="text-h3 text-weight-bold text-primary">Clientes Cadastrados</h1>
      <p class="text-subtitle1">Lista de todos os clientes</p>
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
                placeholder="Buscar por nome ou email..."
                @update:model-value="filterClientes"
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
                @update:model-value="sortClientes"
              >
                <template v-slot:prepend>
                  <q-icon name="sort" />
                </template>
              </q-select>
            </div>
          </div>

          <!-- Tabela de Clientes -->
          <q-table
            :rows="filteredClientes"
            :columns="columns"
            row-key="clienteId"
            :loading="loading"
            :filter="searchText"
            no-data-label="Nenhum cliente encontrado"
            no-results-label="Nenhum resultado encontrado"
            loading-label="Carregando..."
          >
            <!-- Slot para formatar o CPF -->
            <template v-slot:body-cell-cpf="props">
              <q-td :props="props">
                {{ formatCPF(props.value) }}
              </q-td>
            </template>

            <!-- Slot para formatar o telefone -->
            <template v-slot:body-cell-telefone="props">
              <q-td :props="props">
                {{ formatTelefone(props.value) }}
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
                    icon="edit"
                    @click="editCliente(props.row)"
                  >
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

        <!-- Diálogo de Edição -->
        <q-dialog v-model="editDialog">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Editar Cliente</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                v-model="editForm.nome"
                label="Nome"
                dense
                readonly
                outlined
                class="q-mb-md"
              />
              <q-input
                v-model="editForm.email"
                label="Email"
                dense
                outlined
                class="q-mb-md"
                :rules="[
                  (val) => !!val || 'Email é obrigatório',
                  (val) => isValidEmail(val) || 'Email inválido',
                ]"
              />
              <q-input
                v-model="editForm.telefone"
                label="Telefone"
                dense
                outlined
                mask="(##) #####-####"
                class="q-mb-md"
                :rules="[
                  (val) => !!val || 'Telefone é obrigatório',
                  (val) => val.length >= 14 || 'Telefone inválido',
                ]"
              />
              <q-input
                v-model="editForm.cpf"
                label="CPF"
                dense
                readonly
                outlined
                mask="###.###.###-##"
              />
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="primary" v-close-popup />
              <q-btn flat label="Salvar" color="positive" @click="updateCliente" />
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
          <span class="q-ml-sm">Você tem certeza que deseja excluir este cliente?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn
            flat
            label="Excluir"
            color="negative"
            @click="deleteCliente"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useClienteStore } from '../../controller/store/ClienteStore'

export default {
  setup() {
    const $q = useQuasar()
    const clienteStore = useClienteStore()
    const loading = ref(false)
    const searchText = ref('')
    const deleteDialog = ref(false)
    const selectedCliente = ref(null)
    const sortOrder = ref('nome-asc')
    const editDialog = ref(false)

    // Opções de ordenação
    const sortOptions = [
      { label: 'Nome (A-Z)', value: 'nome-asc' },
      { label: 'Nome (Z-A)', value: 'nome-desc' },
      { label: 'Email (A-Z)', value: 'email-asc' },
      { label: 'Email (Z-A)', value: 'email-desc' },
    ]

    // Definição das colunas da tabela
    const columns = [
      {
        name: 'nome',
        required: true,
        label: 'Nome',
        align: 'left',
        field: 'nome',
        sortable: true,
      },
      {
        name: 'email',
        required: true,
        label: 'Email',
        align: 'left',
        field: 'email',
        sortable: true,
      },
      {
        name: 'telefone',
        required: true,
        label: 'Telefone',
        align: 'left',
        field: 'telefone',
        sortable: true,
      },
      {
        name: 'cpf',
        required: true,
        label: 'CPF',
        align: 'left',
        field: 'cpf',
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

    const editForm = ref({
      clienteId: null,
      nome: '',
      email: '',
      telefone: '',
      cpf: ''
    })

    // Carregar clientes ao montar o componente
    onMounted(async () => {
      await fetchClientes()
    })

    // Buscar clientes
    const fetchClientes = async () => {
      loading.value = true
      try {
        await clienteStore.fetch()
        console.log('Clientes carregados:', clienteStore.items)
      } catch (error) {
        console.error('Erro ao carregar clientes:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao carregar clientes',
          caption: error.message || 'Ocorreu um erro inesperado',
          position: 'top',
          timeout: 5000,
        })
      } finally {
        loading.value = false
      }
    }

    // Validação de email
    const isValidEmail = (val) => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      return emailPattern.test(val)
    }

    // Validação de CPF
    const isValidCPF = (cpf) => {
      cpf = cpf.replace(/[^\d]+/g, '')
      if (cpf.length !== 11) return false
      if (/^(\d)\1{10}$/.test(cpf)) return false

      let add = 0
      for (let i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i)
      }
      let rev = 11 - (add % 11)
      if (rev === 10 || rev === 11) rev = 0
      if (rev !== parseInt(cpf.charAt(9))) return false

      add = 0
      for (let i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i)
      }
      rev = 11 - (add % 11)
      if (rev === 10 || rev === 11) rev = 0
      if (rev !== parseInt(cpf.charAt(10))) return false

      return true
    }

    // Filtrar e ordenar clientes
    const filteredClientes = computed(() => {
      let clientes = clienteStore.items || []

      if (searchText.value) {
        const searchLower = searchText.value.toLowerCase()
        clientes = clientes.filter(
          (cliente) =>
            cliente.nome?.toLowerCase().includes(searchLower) ||
            cliente.email?.toLowerCase().includes(searchLower)
        )
      }

      // Aplicar ordenação
      switch (sortOrder.value) {
        case 'nome-asc':
          clientes.sort((a, b) => a.nome.localeCompare(b.nome))
          break
        case 'nome-desc':
          clientes.sort((a, b) => b.nome.localeCompare(a.nome))
          break
        case 'email-asc':
          clientes.sort((a, b) => a.email.localeCompare(b.email))
          break
        case 'email-desc':
          clientes.sort((a, b) => b.email.localeCompare(a.email))
          break
      }

      return clientes
    })

    const formatCPF = (cpf) => {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    const formatTelefone = (telefone) => {
      return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }

    const clearSearch = () => {
      searchText.value = ''
    }

    const editCliente = (cliente) => {
      editForm.value = {
        clienteId: cliente.clienteId,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        cpf: cliente.cpf
      }
      editDialog.value = true
    }

    const updateCliente = async () => {
      try {
        loading.value = true
        await clienteStore.updateItem(editForm.value.clienteId, editForm.value)

        $q.notify({
          type: 'positive',
          message: 'Cliente atualizado com sucesso!'
        })

        editDialog.value = false
        await fetchClientes()
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error)
        $q.notify({
          type: 'negative',
          message: 'Erro ao atualizar cliente',
          caption: error.message || 'Ocorreu um erro inesperado'
        })
      } finally {
        loading.value = false
      }
    }

    const confirmDelete = (cliente) => {
      selectedCliente.value = cliente
      deleteDialog.value = true
    }

    const deleteCliente = async () => {
      try {
        await clienteStore.deleteItem(selectedCliente.value.clienteId)
        $q.notify({
          type: 'positive',
          message: 'Cliente excluído com sucesso!',
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erro ao excluir cliente',
          caption: error.message || 'Ocorreu um erro inesperado',
        })
      }
    }

    return {
      loading,
      searchText,
      sortOrder,
      sortOptions,
      columns,
      filteredClientes,
      deleteDialog,
      editDialog,
      editForm,
      formatCPF,
      formatTelefone,
      clearSearch,
      editCliente,
      updateCliente,
      confirmDelete,
      deleteCliente,
      isValidEmail,
      isValidCPF,
      clientes: computed(() => clienteStore.items)
    }
  },
}
</script>

<style scoped>
.clientes-page {
  max-width: 1200px;
  margin: 0 auto;
}

.q-card {
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
