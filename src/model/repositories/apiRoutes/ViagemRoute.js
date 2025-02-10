class ViagemRoutes {
  constructor(config) {
    this.config = config
    this.name = 'api/viagem'
  }

  get entity() {
    return `${this.name}`
  }

  get delete() {
    return `${this.name}/${this.config.id}`
  }
}

export default ViagemRoutes
