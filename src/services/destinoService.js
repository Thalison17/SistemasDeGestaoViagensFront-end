import axios from 'axios'

class DestinoService {
  constructor() {
    this.baseUrl = 'https://localhost:7068/api/Destino'
  }

  async criarDestino(destino) {
    try {
      const response = await axios.post(this.baseUrl, {
        localizacao: destino.localizacao,
        pais: destino.pais,
        precoPorDia: destino.precoPorDia,
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterTodosDestinos() {
    try {
      const response = await axios.get(this.baseUrl)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterDestinoPorId(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async atualizarDestino(id, destino) {
    try {
      await axios.put(`${this.baseUrl}/${id}`, {
        localizacao: destino.localizacao,
        pais: destino.pais,
        precoPorDia: destino.precoPorDia,
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async excluirDestino(id) {
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

export default new DestinoService()
