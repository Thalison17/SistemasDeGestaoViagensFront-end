import axios from 'axios'

class ViagemService {
  constructor() {
    this.baseUrl = 'https://localhost:7068/api/Viagem'
  }

  async criarViagem(viagem) {
    try {
      const response = await axios.post(this.baseUrl, {
        destinoId: viagem.destinoId,
        dataPartida: viagem.dataPartida,
        dataRetorno: viagem.dataRetorno,
        // Assuming cliente and destino are sent as IDs
        clienteId: viagem.cliente.clienteId,
        destinoId: viagem.destino.destinoId,
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterTodasViagens() {
    try {
      const response = await axios.get(this.baseUrl)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterViagemPorId(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async atualizarViagem(id, viagem) {
    try {
      await axios.put(`${this.baseUrl}/${id}`, {
        destinoId: viagem.destinoId,
        dataPartida: viagem.dataPartida,
        dataRetorno: viagem.dataRetorno,
        // Assuming cliente and destino are sent as IDs
        clienteId: viagem.cliente.clienteId,
        destinoId: viagem.destino.destinoId,
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async excluirViagem(id) {
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

export default new ViagemService()
