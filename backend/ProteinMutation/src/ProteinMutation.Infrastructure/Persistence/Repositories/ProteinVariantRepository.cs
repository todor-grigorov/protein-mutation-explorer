using Microsoft.EntityFrameworkCore;
using ProteinMutation.Domain.Entities;
using ProteinMutation.Domain.Repositories;
using ProteinMutation.Domain.ValueObjects;

namespace ProteinMutation.Infrastructure.Persistence.Repositories
{
    public sealed class ProteinVariantRepository : IProteinVariantRepository
    {
        private readonly AppDbContext _context;

        public ProteinVariantRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ProteinVariant?> GetByVariantIdAsync(
            ProteinVariantId variantId,
            CancellationToken cancellationToken = default)
        {
            return await _context.ProteinVariants
                .FirstOrDefaultAsync(v => v.VariantId == variantId, cancellationToken);
        }

        public async Task<IReadOnlyList<ProteinVariant>> GetByProteinIdAsync(
            string proteinId,
            CancellationToken cancellationToken = default)
        {
            var normalizedProteinId = proteinId.Trim().ToUpperInvariant();

            return await _context.ProteinVariants
                .AsNoTracking()
                .Where(x => x.VariantId.ProteinId == normalizedProteinId)
                .OrderBy(x => x.VariantId.Position)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<ProteinVariant>> SearchAsync(
            string query,
            CancellationToken cancellationToken = default)
        {
            var normalizedQuery = query.Trim().ToUpperInvariant();

            return await _context.ProteinVariants
                .Where(v => EF.Functions.Like(
                    EF.Property<string>(v, "VariantId"),
                    $"%{normalizedQuery}%"))
                .Take(100)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<ProteinVariant>> GetByVariantIdsAsync(
            IEnumerable<ProteinVariantId> variantIds,
            CancellationToken cancellationToken = default)
        {
            var normalizedIds = variantIds
            .Select(x => x.RawValue)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

            if (normalizedIds.Count == 0)
            {
                return [];
            }

            return await _context.ProteinVariants
                .AsNoTracking()
                .Where(x => normalizedIds.Contains(x.VariantId.RawValue))
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<string>> GetAllProteinIdsAsync(
             CancellationToken cancellationToken = default)
        {
            return await _context.ProteinVariants
                .Select(v => EF.Property<string>(v, "ProteinId"))
                .Distinct()
                .OrderBy(id => id)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> AnyAsync(CancellationToken cancellationToken = default)
        {
            return await _context.ProteinVariants.AnyAsync(cancellationToken);
        }
    }
}
