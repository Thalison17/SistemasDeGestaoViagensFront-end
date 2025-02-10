class DestinoRoutes {
  constructor(config) {
    this.config = config
    this.name = 'api/destino'
  }

  get entity() {
    return `${this.name}`
  }

  get delete() {
    return `${this.name}/${this.config.id}`
  }
}
export default DestinoRoutes;
