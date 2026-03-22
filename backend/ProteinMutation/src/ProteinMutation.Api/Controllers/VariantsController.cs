using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProteinMutation.Api.Contracts.Requests;
using ProteinMutation.Api.Contracts.Responses;
using ProteinMutation.Application.Abstractions.Services;

namespace ProteinMutation.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class VariantsController : ControllerBase
    {
        private readonly IServiceManager _service;
        private readonly IMapper _mapper;

        public VariantsController(IServiceManager service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        // GET /api/variants/{variantId}
        //     /api/variants/Q7Z4H8%2FA126C
        [HttpGet("{variantId}")]
        public async Task<ActionResult<ProteinVariantResponse>> GetByVariantId(
            string variantId,
            CancellationToken cancellationToken)
        {
            var decoded = Uri.UnescapeDataString(variantId);
            var dto = await _service.VariantsService.GetByVariantIdAsync(decoded, cancellationToken);
            return Ok(_mapper.Map<ProteinVariantResponse>(dto));
        }

        // GET /api/variants/protein/{proteinId}
        //     /api/variants/protein/Q7Z4H8
        [HttpGet("protein/{proteinId}")]
        public async Task<ActionResult<IReadOnlyList<ProteinVariantResponse>>> GetByProteinId(
            string proteinId,
            CancellationToken cancellationToken)
        {
            var dtos = await _service.VariantsService.GetByProteinIdAsync(proteinId, cancellationToken);
            return Ok(_mapper.Map<IReadOnlyList<ProteinVariantResponse>>(dtos));
        }

        // GET /api/variants/search?query=Q7Z4H8
        [HttpGet("search")]
        public async Task<ActionResult<IReadOnlyList<ProteinVariantResponse>>> Search(
            [FromQuery] string query,
            CancellationToken cancellationToken)
        {
            var dtos = await _service.VariantsService.SearchAsync(query, cancellationToken);
            return Ok(_mapper.Map<IReadOnlyList<ProteinVariantResponse>>(dtos));
        }

        // POST /api/variants/batch
        [HttpPost("batch")]
        public async Task<ActionResult<BatchSubmissionResponse>> ProcessBatch(
            [FromBody] BatchSubmissionRequest request,
            CancellationToken cancellationToken)
        {
            var result = await _service.VariantsService.ProcessBatchAsync(
                request.Variants,
                cancellationToken);

            return Ok(_mapper.Map<BatchSubmissionResponse>(result));
        }
    }
}
