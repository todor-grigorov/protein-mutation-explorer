using AutoMapper;
using ProteinMutation.Application.Abstractions.Services;
using ProteinMutation.Domain.Repositories;

namespace ProteinMutation.Application.Services
{
    public sealed class ServiceManager : IServiceManager
    {
        private readonly Lazy<IVariantsService> _variantsService;
        private readonly Lazy<IProteinsService> _proteinsService;

        public ServiceManager(IProteinVariantRepository repository, IMapper mapper)
        {
            _variantsService = new Lazy<IVariantsService>(() => new VariantsService(repository, mapper));
            _proteinsService = new Lazy<IProteinsService>(() => new ProteinsService(repository, mapper));
        }

        public IVariantsService VariantsService => _variantsService.Value;

        public IProteinsService ProteinsService => _proteinsService.Value;
    }
}
