using System;
using System.Collections.Generic;

namespace ProAgil.Domain
{
    public class Lote
    {
        public int id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public int Quantidade { get; set; }
        public int EventoId { get; set; }
        public Evento Evento { get; set; }
        public List<Lote> Lotes { get; set; }
    }
}