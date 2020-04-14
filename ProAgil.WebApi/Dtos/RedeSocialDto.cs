using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebApi.Dtos
{
    public class RedeSocialDto
    {   
        public int Id { get; set; }
        [Required (ErrorMessage="O campo {0} e obrigatorio")]
        public string Nome { get; set; }
        [Required (ErrorMessage="O campo {0} e obrigatorio")]
        public string URL { get; set; }
    }
}