import api from 'src/services/api'
import Viagem from 'src/model/Viagem'
import ViagemRoutes from './apiRoutes/ViagemRoute'

export default class ViagemRepository {
  constructor() {
    this.apiClient = api
  }

  createBaseRoute() {
    return new ViagemRoutes({}).entity
  }

  createDeleteRoute(id) {
    return new ViagemRoutes({ id }).delete
  }

  async fetchAllViagens() {
    try {
      const baseRoute = this.createBaseRoute()
      const response = await this.apiClient.get(baseRoute)
      return response.data.value.map(
        (viagem) =>
          new Viagem(
            viagem.viagemId,
            viagem.destinoId,
            viagem.dataPartida,
            viagem.dataRetorno,
            viagem.cliente,
            viagem.destino,
          ),
      )
    } catch (error) {
      console.error('Erro ao buscar viagens', error)
      return []
    }
  }

  async createViagem(form) {
    try {
      const baseRoute = this.createBaseRoute()
      const response = await this.apiClient.post(baseRoute, form)
      return response
    } catch (error) {
      console.error('Erro ao criar viagem', error)
      return []
    }
  }

  async updateViagem(id, form) {
    try {
      const baseRoute = this.createBaseRoute()
      form.viagemId = id
      const response = await this.apiClient.put(baseRoute, form)
      return response
    } catch (error) {
      console.error('Erro ao atualizar viagem', error)
      return []
    }
  }

  async deleteViagem(id) {
    try {
      const deleteRoute = this.createDeleteRoute(id)
      const response = await this.apiClient.delete(deleteRoute)
      return response
    } catch (error) {
      console.error('Erro ao deletar viagem', error)
      return []
    }
  }
}
