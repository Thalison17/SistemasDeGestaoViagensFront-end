class Cliente {
    constructor(clienteId, nome, email, telefone, cpf, reservas = []) {
        this.clienteId = clienteId
        this.nome = nome
        this.email = email
        this.telefone = telefone
        this.cpf = cpf
        this.reservas = reservas
    }
}

export default Cliente
