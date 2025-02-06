import api from 'src/services/api'
import Cliente from 'src/model/Cliente'
import ClienteRoutes from './apiRoutes/ClienteRoute'

export default class ClienteRepository {
    constructor() {
      this.apiClient = api;
    }

    createBaseRoute() {
      return new ClienteRoutes({}).entity;
    }

    createDeleteRoute(id) {
      return new ClienteRoutes({ id }).delete;
    }

    async fetchAllCliente() {
      try {
        const baseRoute = this.createBaseRoute();
        const response = await this.apiClient.get(baseRoute);
        return response.data.value.map(cliente => new Cliente(cliente.clienteId, cliente.nome, cliente.email, cliente.telefone, cliente.cpf, cliente.reservas));
      } catch (error) {
        console.error("Erro ao buscar clientes", error);
        return [];
      }
    }

    async createCliente(form) {
      try {
        const baseRoute = this.createBaseRoute();
        const response = await this.apiClient.post(baseRoute, form);
        return response;
      } catch (error) {
        console.error("Erro ao criar cliente", error);
        return [];
      }
    }

    async updateCliente(Id, form) {
      try {
        const baseRoute = this.createBaseRoute();
        form.Id = Id;
        const response = await this.apiClient.put(baseRoute, form);
        return response;
      } catch (error) {
        console.error("Erro ao atualizar cliente", error);
        return [];
      }
    }

    async deleteCliente(Id) {
      try {
        const deleteRoute = this.createDeleteRoute(Id);
        const response = await this.apiClient.delete(deleteRoute);
        return response;
      } catch (error) {
        console.error("Erro ao deletar cliente", error);
        return [];
      }
    }
  }
