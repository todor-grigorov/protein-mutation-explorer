using Microsoft.AspNetCore.Mvc;
using ProteinMutation.Infrastructure.Options;

namespace ProteinMutation.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class StructuresController : ControllerBase
    {
        private readonly StructuralModelsOptions _options;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<StructuresController> _logger;

        // Map protein IDs to their PDB filenames
        private static readonly Dictionary<string, string> PdbFiles = new()
        {
            ["Q7Z4H8"] = "AF-Q7Z4H8-F1-model_v6.pdb",
            ["P12235"] = "AF-P12235-F1-model_v6.pdb",
            ["Q8IUR5"] = "AF-Q8IUR5-F1-model_v6.pdb"
        };

        public StructuresController(
            StructuralModelsOptions options,
            IWebHostEnvironment environment,
            ILogger<StructuresController> logger)
        {
            _options = options;
            _environment = environment;
            _logger = logger;
        }

        // GET /api/structures/{proteinId}
        [HttpGet("{proteinId}")]
        public IActionResult GetStructure(string proteinId)
        {
            var normalizedId = proteinId.Trim().ToUpperInvariant();

            if (!PdbFiles.TryGetValue(normalizedId, out var fileName))
                return NotFound($"No structure available for protein '{proteinId}'.");

            var filePath = Path.Combine(_options.Path, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                _logger.LogError("PDB file not found at path: {FilePath}", filePath);
                return NotFound($"Structure file for protein '{proteinId}' is not available.");
            }

            return PhysicalFile(filePath, "chemical/x-pdb", fileName);
        }
    }
}
