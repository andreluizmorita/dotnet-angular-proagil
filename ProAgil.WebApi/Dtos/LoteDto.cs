using System;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebApi.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public decimal Preco { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        [Range(2, 12000)]
        public int Quantidade { get; set; }
    }
}