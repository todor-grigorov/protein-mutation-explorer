namespace ProteinMutation.Application.Abstractions.Services
{
    public interface IServiceManager
    {
        IVariantsService VariantsService { get; }
        IProteinsService ProteinsService { get; }
    }
}
