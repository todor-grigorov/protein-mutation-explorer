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
            var id = ProteinVariantId.Parse(variantId);

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

        public async Task<IReadOnlyList<ProteinVariantDto>> GetByVariantIdsAsync(
            IEnumerable<string> variantIds,
            CancellationToken cancellationToken = default)
        {
            var idList = variantIds.ToList();

            if (idList.Count == 0)
                throw new InvalidVariantFormatException(
                    string.Empty, "At least one variant ID must be provided.");

            var parsedIds = idList
                .Select(ProteinVariantId.Parse)
                .ToList();

            var variants = await _repository.GetByVariantIdsAsync(parsedIds, cancellationToken);

            return _mapper.Map<IReadOnlyList<ProteinVariantDto>>(variants);
        }
    }
}
