import DestinoRepository from 'src/model/repositories/DestinoRepository'
// eslint-disable-next-line no-unused-vars
import Destino from 'src/model/Destino'

export default class DestinoController {
  constructor() {
    this.DestinoRepository = new DestinoRepository()
  }

  async getAllDestino() {
    return await this.DestinoRepository.fetchAllDestino()
  }

  async create(Destino) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.DestinoRepository.createDestino(Destino)
  }

  async update(Id, Destino) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.DestinoRepository.updateDestino(Id, Destino)
  }

  async delete(Id) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.DestinoRepository.deleteDestino(Id)
  }
}
