class ReservaRoutes {
  constructor(config) {
    this.config = config
    this.name = 'api/reserva'
  }

  get entity() {
    return `${this.name}`
  }

  get update() {
    return `${this.name}/${this.config.id}`
  }

  get delete() {
    return `${this.name}/${this.config.id}`
  }
}

export default ReservaRoutes
