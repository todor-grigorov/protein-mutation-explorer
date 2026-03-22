using AutoMapper;
using ProteinMutation.Application.Abstractions.Services;
using ProteinMutation.Application.DataTransferObjects;
using ProteinMutation.Domain.Repositories;

namespace ProteinMutation.Application.Services
{
    public sealed class ProteinsService : IProteinsService
    {
        private readonly IProteinVariantRepository _repository;
        private readonly IMapper _mapper;

        public ProteinsService(IProteinVariantRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IReadOnlyList<ProteinDto>> GetAllProteinIdsAsync(
            CancellationToken cancellationToken = default)
        {
            var proteinIds = await _repository.GetAllProteinIdsAsync(cancellationToken);
            return _mapper.Map<IReadOnlyList<ProteinDto>>(proteinIds);
        }
    }
}
