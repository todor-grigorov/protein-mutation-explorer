using ProteinMutation.Application.DataTransferObjects;

namespace ProteinMutation.Application.Abstractions.Services
{
    public interface IVariantsService
    {
        Task<ProteinVariantDto> GetByVariantIdAsync(
            string variantId,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyList<ProteinVariantDto>> GetByProteinIdAsync(
            string proteinId,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyList<ProteinVariantDto>> SearchAsync(
            string query,
            CancellationToken cancellationToken = default);

        Task<IReadOnlyList<ProteinVariantDto>> GetByVariantIdsAsync(
            IEnumerable<string> variantIds,
            CancellationToken cancellationToken = default);
    }
}
