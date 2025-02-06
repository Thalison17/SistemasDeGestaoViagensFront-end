class ClienteRoutes {
    constructor(config) {
        this.config = config;
        this.name = 'api/cliente'
    }

    get entity() {
        return `${this.name}`
    }

    get delete() {
        return `${this.name}/${this.config.id}`
    }
}

export default ClienteRoutes
