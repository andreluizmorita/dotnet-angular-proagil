using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
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

                var idLotes = new List<int>();
                var idRedesSociais = new List<int>();

                // MODO - 002
                model.Lotes.ForEach(item => idLotes.Add(item.Id));
                model.RedesSociais.ForEach(item => idRedesSociais.Add(item.Id));

                var lotes = evento.Lotes.Where(
                    lote => !idLotes.Contains(lote.Id)
                ).ToArray();

                var redesSociais = evento.RedesSociais.Where(
                    redeSocial => !idRedesSociais.Contains(redeSocial.Id)
                ).ToArray();

                if (lotes.Length > 0) _repository.DeleteRange(lotes);
                if (redesSociais.Length > 0) _repository.DeleteRange(redesSociais);

                // MODO - 001
                // foreach(var item in model.Lotes)
                // {
                //     idLotes.Add(item.Id);
                // }

                // foreach (var item in model.RedesSociais)
                // {
                //     idRedesSociais.Add(item.Id);
                // }

                // var lotes = evento.Lotes.Where(lote => !idLotes.Contains(lote.Id)).ToList<Lote>();
                // var redesSociais = evento.RedesSociais.Where(redeSocial => !idRedesSociais.Contains(redeSocial.Id)).ToList<RedeSocial>();
                
                // if (lotes.Count() > 0) 
                // {
                //     lotes.ForEach(lote => _repository.Delete(lote));
                // }
                   
                // if (redesSociais.Count() > 0) 
                // {
                //     redesSociais.ForEach(redeSocial => _repository.Delete(redeSocial));
                // }

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

        [HttpPost("upload")]
        public async Task<IActionResult> upload()
        {
            try 
            {   
                var eventos = await _repository.GetAllEventosAsync(true);

                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0) 
                {
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, filename.Replace("\"", "").Trim());

                    using( var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Server error. Erro: {ex.Message}");
            }
        }
    }
}