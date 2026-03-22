using ProteinMutation.Application.DataTransferObjects;

namespace ProteinMutation.Application.Abstractions.Services
{
    public interface IProteinsService
    {
        Task<IReadOnlyList<ProteinDto>> GetAllProteinIdsAsync(
            CancellationToken cancellationToken = default);
    }
}
