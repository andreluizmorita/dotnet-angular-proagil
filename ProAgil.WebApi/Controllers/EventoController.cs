using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebApi.Dtos;

namespace ProAgil.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {   
        private readonly IProAgilRepository _repository;
        private readonly IMapper _mapper;

        public EventoController(IProAgilRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET api/eventos
        [HttpGet]
        public async Task<IActionResult> Get()
        {   
            try
            {
                var eventos = await _repository.GetAllEventosAsync(true);
                var results = _mapper.Map<IEnumerable<EventoDto>>(eventos);

                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Server error. Erro: {ex.Message}");
            }
        }

        // GET api/evento/5
        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {   
            try
            {
                var evento = await _repository.GetEventoAsyncById(EventoId, true);
                var results = _mapper.Map<EventoDto>(evento);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Server error. Erro: {ex.Message}");
            }
        }

        // GET api/evento/getByTema/5
        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {   
            try
            {
                var results = await _repository.GetAllEventosAsyncByTema(tema, true);
                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Server error. Erro: {ex.Message}");
            }
        }

        // POST api/evento
        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {   
            // Sem o [ApiController]
            // public async Task<IActionResult> Post([FromBody]EventoDto model)
            // {   
            // if (!ModelState.IsValid)
            // {
            //     return this.StatusCode(StatusCodes.Status400BadRequest, ModelState);
            // }

            try
            {   
                var evento = _mapper.Map<Evento>(model);
                _repository.Add(evento);

                if(await _repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", model);
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Server error. Erro: {ex.Message}");
            }

            return BadRequest();
        }

        // PUT api/evento/5
        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {   
            try
            {
                var evento = await _repository.GetEventoAsyncById(EventoId, false);

                if(evento == null) return NotFound();

                _mapper.Map(model, evento);

                _repository.Update(evento);

                if(await _repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Server error. Erro: {ex.Message}");
            }

            return BadRequest();
        }

        // DELETE api/eventos/5
        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {   
            try
            {
                var evento = await _repository.GetEventoAsyncById(EventoId, false);

                if(evento == null) return NotFound();

                _repository.Delete(evento);

                if(await _repository.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Server error. Erro: {ex.Message}");
            }

            return BadRequest();
        }
    }
}