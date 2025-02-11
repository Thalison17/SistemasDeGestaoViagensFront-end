class DestinoRoutes {
  constructor(config) {
    this.config = config
    this.name = 'api/destino'
  }

  get entity() {
    return `${this.name}`
  }

  get update() {
    return `${this.name}/${this.config.id}`
  }

  get delete() {
    return `${this.name}/delete/${this.config.id}`
  }
}
export default DestinoRoutes
