/*
public class Destino
{
    public int DestinoId { get; set; }
    public string Localizacao { get; set; }
    public string Pais { get; set; }
    public decimal PrecoPorDia { get; set; }
}


 */
class Destino {
  constructor(destinoId, localizacao, pais, precoPorDia) {
    this.destinoId = destinoId
    this.localizacao = localizacao
    this.pais = pais
    this.precoPorDia = precoPorDia
  }
}

export default Destino
