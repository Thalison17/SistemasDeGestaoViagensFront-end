class ReservaRoutes {
  constructor(config) {
    this.config = config
    this.name = 'api/reserva'
  }

  get entity() {
    return `${this.name}`
  }

  get delete() {
    return `${this.name}/${this.config.id}`
  }
}

export default ReservaRoutes
