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
      return response.data.value.map(
        (reserva) =>
          new Reserva(
            reserva.reservaId,
            reserva.clienteId,
            reserva.viagemId,
            reserva.dataReserva,
            reserva.metodoPagamento,
            reserva.custoTotal,
            reserva.cliente, // Assuming cliente is an object with necessary properties
            reserva.viagem, // Assuming viagem is an object with necessary properties
            reserva.duracaoDias,
          ),
      )
    } catch (error) {
      console.error('Erro ao buscar reservas', error)
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
      form.reservaId = id // Assuming reservaId is used for updates
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
