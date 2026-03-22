using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProteinMutation.Api.Contracts.Responses;
using ProteinMutation.Application.Abstractions.Services;

namespace ProteinMutation.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class ProteinsController : ControllerBase
    {
        private readonly IServiceManager _service;
        private readonly IMapper _mapper;

        public ProteinsController(IServiceManager service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        // GET /api/proteins
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProteinResponse>>> GetAll(
            CancellationToken cancellationToken)
        {
            var dtos = await _service.ProteinsService.GetAllProteinIdsAsync(cancellationToken);
            return Ok(_mapper.Map<IReadOnlyList<ProteinResponse>>(dtos));
        }
    }
}
