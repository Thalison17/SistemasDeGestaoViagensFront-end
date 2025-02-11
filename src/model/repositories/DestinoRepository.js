import api from 'src/services/api'
import Destino from 'src/model/Destino'
import DestinoRoutes from 'src/model/repositories/apiRoutes/DestinoRoute'

export default class DestinoRepository {
  constructor() {
    this.apiClient = api
  }

  createBaseRoute() {
    return new DestinoRoutes({}).entity
  }

  createDeleteRoute(id) {
    return new DestinoRoutes({ id }).delete
  }

  async fetchAllDestino() {
    try {
      const baseRoute = this.createBaseRoute()
      const response = await this.apiClient.get(baseRoute)
      return response.data.value.map(
        (destino) =>
          new Destino(
            destino.destinoId,
            destino.localizacao,
            destino.pais,
            destino.precoPorDia,
          ),
      )
    } catch (error) {
      console.error('Erro ao buscar destinos', error)
      return []
    }
  }

  async createDestino(form) {
    try {
      const baseRoute = this.createBaseRoute()
      const response = await this.apiClient.post(baseRoute, form)
      return response
    } catch (error) {
      console.error('Erro ao criar destino', error)
      return []
    }
  }

  async updateDestino(Id, form) {
    try {
      const baseRoute = this.createBaseRoute()
      form.Id = Id
      const response = await this.apiClient.put(baseRoute, form)
      return response
    } catch (error) {
      console.error('Erro ao atualizar destino', error)
      return []
    }
  }

  async deleteDestino(Id) {
    try {
      const deleteRoute = this.createDeleteRoute(Id)
      const response = await this.apiClient.delete(deleteRoute)
      return response
    } catch (error) {
      console.error('Erro ao deletar destino', error)
      return []
    }
  }
}
