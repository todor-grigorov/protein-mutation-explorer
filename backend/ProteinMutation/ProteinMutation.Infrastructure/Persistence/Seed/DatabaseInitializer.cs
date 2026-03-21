using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProteinMutation.Infrastructure.Options;

namespace ProteinMutation.Infrastructure.Persistence.Seed
{
    public sealed class DatabaseInitializer
    {
        private readonly AppDbContext _context;
        private readonly TsvVariantImporter _importer;
        private readonly DatabaseOptions _options;
        private readonly ILogger<DatabaseInitializer> _logger;

        public DatabaseInitializer(
            AppDbContext context,
            TsvVariantImporter importer,
            DatabaseOptions options,
            ILogger<DatabaseInitializer> logger)
        {
            _context = context;
            _importer = importer;
            _options = options;
            _logger = logger;
        }

        public async Task InitializeAsync(CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Running database migrations...");
            await _context.Database.MigrateAsync(cancellationToken);

            var alreadySeeded = await _context.ProteinVariants
                .AnyAsync(cancellationToken);

            if (alreadySeeded)
            {
                _logger.LogInformation("Database already seeded. Skipping.");
                return;
            }

            _logger.LogInformation("Seeding database from TSV...");

            var variants = _importer.ImportFromFile(_options.TsvFilePath);

            // Batch insert for performance — 32k rows in one shot is fine for SQLite
            await _context.ProteinVariants.AddRangeAsync(variants, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Seeding complete. {Count} variants inserted.", variants.Count);
        }
    }
}
