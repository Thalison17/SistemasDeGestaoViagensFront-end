import axios from 'axios'

class ReservaService {
  constructor() {
    this.baseUrl = 'https://localhost:7068/api/Reserva'
  }

  async criarReserva(reserva) {
    try {
      const response = await axios.post(this.baseUrl, {
        clienteId: reserva.clienteId,
        viagemId: reserva.viagemId,
        dataReserva: reserva.dataReserva,
        metodoPagamento: reserva.metodoPagamento,
        custoTotal: reserva.custoTotal,
      })
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterTodasReservas() {
    try {
      const response = await axios.get(this.baseUrl)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async obterReservaPorId(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/${id}`)
      return response.data
    } catch (error) {
      this.handleError(error)
    }
  }

  async atualizarReserva(id, reserva) {
    try {
      await axios.put(`${this.baseUrl}/${id}`, {
        clienteId: reserva.clienteId,
        viagemId: reserva.viagemId,
        dataReserva: reserva.dataReserva,
        metodoPagamento: reserva.metodoPagamento,
        custoTotal: reserva.custoTotal,
      })
    } catch (error) {
      this.handleError(error)
    }
  }

  async excluirReserva(id) {
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

export default new ReservaService()
