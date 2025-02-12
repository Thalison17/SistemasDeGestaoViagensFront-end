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
        const response = await this.apiClient.get(`${baseRoute}`) 

        if (!response || !response.data) {
            console.log('Nenhuma reserva encontrada')
            return []
        }

        const [reservasData, clientesResponse, destinosResponse] = await Promise.all([
            response.data,
            this.apiClient.get('api/cliente'),
            this.apiClient.get('api/destino')
        ])

        const clientes = clientesResponse.data.reduce((acc, cliente) => {
            acc[cliente.clienteId] = cliente
            return acc
        }, {})

        const destinos = destinosResponse.data.reduce((acc, destino) => {
            acc[destino.destinoId] = destino
            return acc
        }, {})

        return reservasData.map(reserva => {
            const cliente = clientes[reserva.clienteId]
            const destino = destinos[reserva.viagem?.destinoId]

            return new Reserva(
                reserva.reservaId,
                reserva.clienteId,
                reserva.viagemId,
                reserva.dataReserva,
                reserva.metodoPagamento,
                reserva.custoTotal,
                cliente || { nome: 'N/A' },
                {
                    ...reserva.viagem,
                    destino: destino || { localizacao: 'N/A' }
                },
                reserva.duracaoDias
            )
        })
    } catch (error) {
        console.error('Erro ao buscar reservas:', error)
        throw error
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

  validateUpdateData(data) {
    if (!data) throw new Error('Dados inválidos')
    
    const requiredFields = [
      'reservaId',
      'clienteId',
      'viagemId',
      'statusPagamento',
      'viagem'  // Add viagem as a required field
    ]
  
    const validatedData = {
      reservaId: parseInt(data.reservaId),
      clienteId: parseInt(data.clienteId),
      viagemId: parseInt(data.viagemId),
      dataReserva: data.dataReserva,
      statusPagamento: String(data.statusPagamento),
      metodoPagamento: data.metodoPagamento || '',
      custoTotal: parseFloat(data.custoTotal) || 0,
      duracaoDias: parseInt(data.duracaoDias || 0),
      viagem: data.viagem  // Include the viagem object
    }
  
    requiredFields.forEach(field => {
      if (validatedData[field] === undefined || validatedData[field] === null) {
        throw new Error(`Campo obrigatório ausente: ${field}`)
      }
    })
  
    // Validate viagem object separately
    if (validatedData.viagem) {
      const requiredViagemFields = ['id', 'destinoId', 'status', 'dataPartida', 'dataRetorno']
      requiredViagemFields.forEach(field => {
        if (!validatedData.viagem[field]) {
          throw new Error(`Campo obrigatório ausente na viagem: ${field}`)
        }
      })
    }
  
    return validatedData
  }

  async updateReserva(id, form) {
    try {
      const baseRoute = this.createBaseRoute()
      
      // Validate and format the data
      const validatedData = this.validateUpdateData(form)
      
      console.log('Enviando requisição:', {
        url: `${baseRoute}/${id}`,
        data: validatedData
      })
  
      const response = await this.apiClient.put(`${baseRoute}/${id}`, validatedData)
      
      console.log('Resposta do servidor:', response) // Debug log
  
      // Check if response exists
      if (!response) {
        throw new Error('Não houve resposta do servidor')
      }
  
      // Return the response data or a success message
      return response.data || { success: true, message: 'Reserva atualizada com sucesso' }
  
    } catch (error) {
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
  
      // Throw a more specific error
      if (error.response?.status === 400) {
        throw new Error('Dados inválidos para atualização')
      } else if (error.response?.status === 404) {
        throw new Error('Reserva não encontrada')
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Erro ao atualizar reserva')
      }
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
