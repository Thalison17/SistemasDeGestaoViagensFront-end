import axios from 'axios'

class ClienteService {
  constructor() {
    this.baseUrl = 'https://localhost:7068/api/Cliente'
  }

  async criarCliente(cliente) {
    try {
      const response = await axios.post(this.baseUrl, {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone.replace(/\D/g, ''),
        cpf: cliente.cpf.replace(/\D/g, '')
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterTodosClientes() {
    try {
      const response = await axios.get(this.baseUrl)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterClientePorId(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async atualizarCliente(id, cliente) {
    try {
      await axios.put(`${this.baseUrl}/${id}`, {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone.replace(/\D/g, ''),
        cpf: cliente.cpf.replace(/\D/g, '')
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async excluirCliente(id) {
    try {
      await axios.delete(`${this.baseUrl}/${id}`)
    } catch (error) {
      this.handleError(error)
    }
  }

  handleError(error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || 'Erro desconhecido'
      throw new Error(errorMessage)
    }
    throw error
  }
}

export default new ClienteService()
