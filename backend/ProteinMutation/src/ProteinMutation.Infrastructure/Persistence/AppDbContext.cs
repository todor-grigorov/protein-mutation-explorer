using Microsoft.EntityFrameworkCore;
using ProteinMutation.Domain.Entities;

namespace ProteinMutation.Infrastructure.Persistence
{
    public sealed class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<ProteinVariant> ProteinVariants => Set<ProteinVariant>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
            base.OnModelCreating(modelBuilder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries<ProteinVariant>()
                .Where(e => e.State is EntityState.Added or EntityState.Modified))
            {
                entry.Property("ProteinId").CurrentValue =
                    entry.Entity.VariantId.ProteinId;
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
