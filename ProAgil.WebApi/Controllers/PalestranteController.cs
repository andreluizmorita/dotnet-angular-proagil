using Microsoft.AspNetCore.Mvc;
using ProAgil.Repository;

namespace ProAgil.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController : ControllerBase
    {
        private readonly IProAgilRepository _repository;
        public PalestranteController(IProAgilRepository repository)
        {
            _repository = repository;
        }
    }
}