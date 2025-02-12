import ClienteRepository from 'src/model/repositories/ClienteRepository'
// eslint-disable-next-line no-unused-vars
import Cliente from 'src/model/Cliente'

export default class ClienteController {
  constructor() {
    this.ClienteRepository = new ClienteRepository()
  }

  async getAll() {
    return await this.ClienteRepository.fetchAllCliente()
  }

  async fetchById(id) {
    return await this.ClienteRepository.fetchById(id)
  }

  async create(Cliente) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.ClienteRepository.createCliente(Cliente)
  }
  async update(Id, Cliente) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.ClienteRepository.updateCliente(Id, Cliente)
  }

  async delete(Id) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.ClienteRepository.deleteCliente(Id)
  }
}
