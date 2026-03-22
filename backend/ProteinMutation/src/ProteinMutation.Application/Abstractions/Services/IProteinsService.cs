namespace ProteinMutation.Application.Abstractions.Services
{
    public interface IProteinsService
    {
        Task<IReadOnlyList<string>> GetAllProteinIdsAsync(
            CancellationToken cancellationToken = default);
    }
}
