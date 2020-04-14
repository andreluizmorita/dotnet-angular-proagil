using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebApi.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }
        [Required (ErrorMessage="Campo obrigatorio")]
        [StringLength (100, MinimumLength=3, ErrorMessage="Local e entre 3 100 caracteres")]
        public string Local { get; set; }
        public DateTime DataEvento { get; set; }
        [Required (ErrorMessage="O tema deve ser preenchido")]
        public string Tema { get; set; }
        [Range(2, 200, ErrorMessage="Qnt entre 2 e 200")]
        public int QtdPessoas { get; set; }
        [Phone]
        public string Telefone { get; set; }
        public string Lote { get; set; }
        public string ImageUrl { get; set; }
        [EmailAddress (ErrorMessage="E-mail invalido")]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}