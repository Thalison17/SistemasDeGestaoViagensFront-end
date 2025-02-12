import DestinoRepository from 'src/model/repositories/DestinoRepository'
// eslint-disable-next-line no-unused-vars
import Destino from 'src/model/Destino'

export default class DestinoController {
  constructor() {
    this.DestinoRepository = new DestinoRepository()
  }

  async getAll() {
    return await this.DestinoRepository.fetchAllDestino()
  }

  async create(Destino) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.DestinoRepository.createDestino(Destino)
  }

  async update(id, destino) {
    if (import.meta.env.VITE_MOCK === 'true') return
    try {
      const response = await this.DestinoRepository.updateDestino(id, destino)
      return response.data
    } catch (error) {
      console.error('Controller error updating destino:', error)
      throw error
    }
  }

  async delete(Id) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.DestinoRepository.deleteDestino(Id)
  }
}
