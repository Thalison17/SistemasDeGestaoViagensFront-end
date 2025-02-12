/*
public class Reserva
{
    public int ReservaId { get; set; }
    public int ClienteId { get; set; }
    public int ViagemId { get; set; }
    public DateTime DataReserva { get; set; }
    public string StatusPagamento { get; set; } = "Pendente";
    public string MetodoPagamento { get; set; }
    public decimal CustoTotal { get; set; }
    public Cliente Cliente { get; set; }
    public Viagem Viagem { get; set; }
    public int DuracaoDias { get; set; }
}
 */

class Reserva {
  constructor(
    reservaId,
    clienteId,
    viagemId,
    dataReserva,
    metodoPagamento,
    custoTotal,
    cliente,
    viagem,
    duracaoDias,
  ) {
    this.reservaId = reservaId
    this.clienteId = clienteId
    this.viagemId = viagemId
    this.dataReserva = dataReserva
    this.statusPagamento = 'Pendente'
    this.metodoPagamento = metodoPagamento
    this.custoTotal = custoTotal
    this.cliente = cliente
    this.viagem = viagem
    this.duracaoDias = duracaoDias
  }
}

export default Reserva
