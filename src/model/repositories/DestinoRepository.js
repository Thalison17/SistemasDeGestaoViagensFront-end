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
      const destinos = response.data
      return destinos.map(destino =>
        new Destino(
          destino.destinoId,
          destino.localizacao,
          destino.pais,
          destino.precoPorDia
        )
      )
    } catch (error) {
      console.error('Erro ao buscar destinos', error)
      throw error
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

  async updateDestino(id, form) {
    try {
      const baseRoute = this.createBaseRoute()
      const response = await this.apiClient.put(`${baseRoute}/${id}`, {
        destinoId: id,
        localizacao: form.localizacao,
        pais: form.pais,
        precoPorDia: form.precoPorDia
      })
      return response
    } catch (error) {
      console.error('Repository error updating destino:', error)
      throw error
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
