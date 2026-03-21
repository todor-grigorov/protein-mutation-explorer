using ProteinMutation.Domain.Entities;
using ProteinMutation.Domain.ValueObjects;

namespace ProteinMutation.Domain.Repositories
{
    public interface IProteinVariantRepository
    {
        // Get a single variant by its full ID e.g. "Q7Z4H8/A126C"
        Task<ProteinVariant?> GetByVariantIdAsync(
            ProteinVariantId variantId,
            CancellationToken cancellationToken = default);

        // Get all variants for a specific protein e.g. "Q7Z4H8"
        Task<IReadOnlyList<ProteinVariant>> GetByProteinIdAsync(
            string proteinId,
            CancellationToken cancellationToken = default);

        // Search by partial variant ID or protein ID
        Task<IReadOnlyList<ProteinVariant>> SearchAsync(
            string query,
            CancellationToken cancellationToken = default);

        // Bulk lookup — for when user submits multiple variants at once
        Task<IReadOnlyList<ProteinVariant>> GetByVariantIdsAsync(
            IEnumerable<ProteinVariantId> variantIds,
            CancellationToken cancellationToken = default);

        // Used by the seeder to check if DB is already populated
        Task<bool> AnyAsync(CancellationToken cancellationToken = default);
    }
}
