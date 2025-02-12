import api from 'src/services/api'
import Reserva from 'src/model/Reserva'
import ReservaRoutes from './apiRoutes/ReservaRoute'

export default class ReservaRepository {
  constructor() {
    this.apiClient = api
  }

  createBaseRoute() {
    return new ReservaRoutes({}).entity
  }

  createDeleteRoute(id) {
    return new ReservaRoutes({ id }).delete
  }

  async fetchAllReservas() {
    try {
      const baseRoute = this.createBaseRoute()
      const response = await this.apiClient.get(baseRoute)
      
      // Se não houver resposta, retorna array vazio
      if (!response || !response.data) {
        console.log('Nenhuma reserva encontrada')
        return []
      }

      // Verifica se a resposta é um array ou objeto
      const reservasData = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response.data.value)
          ? response.data.value
          : []

      // Se não houver dados, retorna array vazio
      if (!reservasData.length) {
        console.log('Nenhuma reserva encontrada')
        return []
      }

      return reservasData.map(reserva => {
        try {
          return new Reserva(
            reserva.reservaId,
            reserva.clienteId,
            reserva.viagemId,
            reserva.dataReserva,
            reserva.metodoPagamento,
            reserva.custoTotal,
            reserva.cliente,
            reserva.viagem,
            reserva.duracaoDias
          )
        } catch (err) {
          console.error('Erro ao processar reserva:', err)
          return null
        }
      }).filter(reserva => reserva !== null)

    } catch (error) {
      console.error('Erro ao buscar reservas:', error)
      return []
    }
  }

  async createReserva(form) {
    try {
      const baseRoute = this.createBaseRoute()
      const response = await this.apiClient.post(baseRoute, form)
      return response
    } catch (error) {
      console.error('Erro ao criar reserva', error)
      return []
    }
  }

  async updateReserva(id, form) {
    try {
      const baseRoute = this.createBaseRoute()
      form.reservaId = id
      const response = await this.apiClient.put(baseRoute, form)
      return response
    } catch (error) {
      console.error('Erro ao atualizar reserva', error)
      return []
    }
  }

  async deleteReserva(id) {
    try {
      const deleteRoute = this.createDeleteRoute(id)
      const response = await this.apiClient.delete(deleteRoute)
      return response
    } catch (error) {
      console.error('Erro ao deletar reserva', error)
      return []
    }
  }
}
