/*

public class Viagem
{
    public int ViagemId { get; set; }
    public int DestinoId { get; set; }
    public DateTime DataPartida { get; set; }
    public DateTime DataRetorno { get; set; }
    public string Status { get; set; } = "Pendente";
    public Cliente Cliente { get; set; }
    public Destino Destino { get; set; }
}

 */

class Viagem {
  constructor(viagemId, destinoId, dataPartida, dataRetorno, cliente, destino) {
    this.viagemId= viagemId;
    this.destinoId = destinoId;
    this.dataPartida = dataPartida;
    this.dataRetorno = dataRetorno;
    this.status = "pendente";
    this.cliente = cliente;
    this.destino = destino;
  }
}

export default Viagem
