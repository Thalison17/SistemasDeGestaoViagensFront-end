import ReservaRepository from 'src/model/repositories/ReservaRepository'
// eslint-disable-next-line no-unused-vars
import Reserva from 'src/model/Reserva'

export default class ReservaController {
  constructor() {
    this.reservaRepository = new ReservaRepository()
  }

  async getAllReservas() {
    return await this.reservaRepository.fetchAllReservas()
  }

  async create(reserva) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.reservaRepository.createReserva(reserva)
  }

  async update(id, reserva) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.reservaRepository.updateReserva(id, reserva)
  }

  async delete(id) {
    if (import.meta.env.VITE_MOCK === 'true') return
    return await this.reservaRepository.deleteReserva(id)
  }
}
