import ClienteRepository from "src/model/repositories/ClienteRepository"
// eslint-disable-next-line no-unused-vars
import Cliente from 'src/model/Cliente'

export default class ClienteController {
    constructor() {
        this.ClienteRepository = new ClienteRepository()
    }

    async getAllCliente() {
        return await this.ClienteRepository.fetchAllCliente()
    }

    async create(Cliente) {
        if (import.meta.env.VITE_MOCK === "true") return
        return await this.ClienteRepository.createCliente(Cliente)
    }
    async update(Id, Cliente) {
        if (import.meta.env.VITE_MOCK === "true") return
        return await this.clienteRepository.updateCliente(Id, Cliente);
      }

      async delete(Id) {
        if (import.meta.env.VITE_MOCK === "true") return
        return await this.clienteRepository.deleteCliente(Id);
      }
    }
