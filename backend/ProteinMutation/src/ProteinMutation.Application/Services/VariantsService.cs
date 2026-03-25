using AutoMapper;
using ProteinMutation.Application.Abstractions.Services;
using ProteinMutation.Application.DataTransferObjects;
using ProteinMutation.Domain.Exceptions;
using ProteinMutation.Domain.Repositories;
using ProteinMutation.Domain.ValueObjects;

namespace ProteinMutation.Application.Services
{
    public sealed class VariantsService : IVariantsService
    {
        private readonly IProteinVariantRepository _repository;
        private readonly IMapper _mapper;

        public VariantsService(IProteinVariantRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<ProteinVariantDto> GetByVariantIdAsync(
            string variantId,
            CancellationToken cancellationToken = default)
        {
            // Normalize space-separated format to slash format
            var normalized = variantId.Contains('/')
                ? variantId
                : variantId.Replace(' ', '/');

            var id = ProteinVariantId.Parse(normalized);

            var variant = await _repository.GetByVariantIdAsync(id, cancellationToken);

            if (variant is null)
                throw new VariantNotFoundException(variantId);

            return _mapper.Map<ProteinVariantDto>(variant);
        }

        public async Task<IReadOnlyList<ProteinVariantDto>> GetByProteinIdAsync(
            string proteinId,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(proteinId))
                throw new InvalidVariantFormatException(proteinId, "Protein ID cannot be empty.");

            var variants = await _repository.GetByProteinIdAsync(
                proteinId.Trim().ToUpperInvariant(),
                cancellationToken);

            return _mapper.Map<IReadOnlyList<ProteinVariantDto>>(variants);
        }

        public async Task<IReadOnlyList<ProteinVariantDto>> SearchAsync(
            string query,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(query))
                throw new InvalidVariantFormatException(query, "Search query cannot be empty.");

            var variants = await _repository.SearchAsync(query.Trim(), cancellationToken);

            return _mapper.Map<IReadOnlyList<ProteinVariantDto>>(variants);
        }

        public async Task<BatchSubmissionResult> ProcessBatchAsync(
        IEnumerable<string> rawInputLines,
        CancellationToken cancellationToken = default)
        {
            var lines = rawInputLines
                .Select(l => l.Trim())
                .Where(l => !string.IsNullOrWhiteSpace(l))
                .ToList();

            if (lines.Count == 0)
                throw new InvalidVariantFormatException(
                    string.Empty, "At least one variant must be provided.");

            var validIds = new List<ProteinVariantId>();
            var invalid = new List<InvalidVariantEntry>();

            // Step 1 — parse and validate each line
            // Step 1 — parse and validate each line
            foreach (var line in lines)
            {
                var normalized = line.Contains('/')
                    ? line
                    : line.Replace(' ', '/');

                if (ProteinVariantId.TryParse(normalized, out var id))
                    validIds.Add(id!);
                else
                    invalid.Add(new InvalidVariantEntry(
                        Input: line,
                        Reason: "Invalid format. Expected: Q7Z4H8/A126C or Q7Z4H8 A126C"));
            }

            // Deduplicate valid IDs before repository call
            var uniqueIds = validIds
                .GroupBy(id => id.RawValue)
                .Select(g => g.First())
                .ToList();

            // Step 2 — bulk lookup valid IDs in one DB round trip
            var found = uniqueIds.Count > 0
                ? await _repository.GetByVariantIdsAsync(uniqueIds, cancellationToken)
                : [];

            // Step 3 — determine which valid IDs had no match in the DB
            var foundRawIds = found
                .Select(v => v.VariantId.RawValue)
                .ToHashSet();

            var notFound = uniqueIds
                .Where(id => !foundRawIds.Contains(id.RawValue))
                .Select(id => id.RawValue)
                .ToList();

            // Step 4 — map to DTOs
            var foundDtos = _mapper.Map<IReadOnlyList<ProteinVariantDto>>(found);

            return new BatchSubmissionResult(foundDtos, notFound, invalid);
        }
    }
}
