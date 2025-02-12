import ViagemRepository from 'src/model/repositories/ViagemRepository'
// eslint-disable-next-line no-unused-vars
import Viagem from 'src/model/Viagem'

export default class ViagemController {
  constructor() {
    this.viagemRepository = new ViagemRepository()
  }

  async getAll() {
    return await this.viagemRepository.fetchAllViagens()
  }

  async create(viagem) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.viagemRepository.createViagem(viagem)
  }

  async update(id, viagem) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.viagemRepository.updateViagem(id, viagem)
  }

  async delete(id) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.viagemRepository.deleteViagem(id)
  }
}
