using ProteinMutation.Domain.Entities;

namespace ProteinMutation.Application.Abstractions.Services
{
    public interface IVariantsService
    {
        Task<ProteinVariant> GetByVariantIdAsync(
            string variantId,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyList<ProteinVariant>> GetByProteinIdAsync(
            string proteinId,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyList<ProteinVariant>> SearchAsync(
            string query,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyList<ProteinVariant>> GetByVariantIdsAsync(
            IEnumerable<string> variantIds,
            CancellationToken cancellationToken = default);
    }
}
