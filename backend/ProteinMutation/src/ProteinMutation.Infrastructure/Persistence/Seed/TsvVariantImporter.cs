using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.Extensions.Logging;
using ProteinMutation.Domain.Entities;
using ProteinMutation.Domain.Enums;
using ProteinMutation.Domain.ValueObjects;
using System.Globalization;

namespace ProteinMutation.Infrastructure.Persistence.Seed
{
    public sealed class TsvVariantImporter
    {
        private readonly ILogger<TsvVariantImporter> _logger;

        public TsvVariantImporter(ILogger<TsvVariantImporter> logger)
        {
            _logger = logger;
        }

        public IReadOnlyList<ProteinVariant> ImportFromFile(string filePath)
        {
            if (!File.Exists(filePath))
                throw new FileNotFoundException($"TSV data file not found at '{filePath}'.");

            _logger.LogInformation("Importing variants from {FilePath}", filePath);

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = "\t",
                HasHeaderRecord = true,
                MissingFieldFound = null,
                BadDataFound = context =>
                    _logger.LogWarning("Bad data at row {Row}: {Field}",
                        context.Context.Parser.Row, context.Field)
            };

            using var reader = new StreamReader(filePath);
            using var csv = new CsvReader(reader, config);

            var variants = new List<ProteinVariant>();
            var skipped = 0;

            var rows = csv.GetRecords<TsvVariantRow>();

            foreach (var row in rows)
            {
                try
                {
                    var variant = MapRowToEntity(row);
                    variants.Add(variant);
                }
                catch (Exception ex)
                {
                    skipped++;
                    _logger.LogWarning(ex,
                        "Skipping row with variant_id '{VariantId}' due to mapping error.",
                        row.VariantId);
                }
            }

            _logger.LogInformation(
                "Import complete. {Imported} variants imported, {Skipped} skipped.",
                variants.Count, skipped);

            return variants;
        }

        private static ProteinVariant MapRowToEntity(TsvVariantRow row)
        {
            var variantId = ProteinVariantId.Parse(row.VariantId);

            var amClass = row.AmClass.ToLowerInvariant() switch
            {
                "pathogenic" => AlphaMissenseClass.Pathogenic,
                "ambiguous" => AlphaMissenseClass.Ambiguous,
                "benign" => AlphaMissenseClass.Benign,
                _ => throw new InvalidOperationException(
                    $"Unknown am_class value: '{row.AmClass}'")
            };

            var esmClass = row.Esm1bIsPathogenic.ToLowerInvariant() switch
            {
                "pathogenic" => EsmPathogenicityClass.Pathogenic,
                "benign" => EsmPathogenicityClass.Benign,
                _ => throw new InvalidOperationException(
                    $"Unknown ESM1b_is_pathogenic value: '{row.Esm1bIsPathogenic}'")
            };

            var mechanisticLabel = row.MechanisticLabel switch
            {
                "Unassigned" => MechanisticLabel.Unassigned,
                "Stability" => MechanisticLabel.Stability,
                "Pockets" => MechanisticLabel.Pockets,
                "Interface" => MechanisticLabel.Interface,
                _ => throw new InvalidOperationException(
                    $"Unknown mechanistic_label value: '{row.MechanisticLabel}'")
            };

            double? predDdg = string.IsNullOrWhiteSpace(row.PredDdg)
                ? null
                : double.Parse(row.PredDdg, CultureInfo.InvariantCulture);

            double? interfacePdockq = string.IsNullOrWhiteSpace(row.InterfacePdockq)
                ? null
                : double.Parse(row.InterfacePdockq, CultureInfo.InvariantCulture);

            return ProteinVariant.Create(
                variantId,
                row.AmPathogenicity,
                amClass,
                row.AmLabel,
                row.Esm1bLlr,
                esmClass,
                predDdg,
                row.PredDdgLabel,
                interfacePdockq,
                row.InterfaceLabel,
                row.PocketLabel,
                mechanisticLabel);
        }
    }
}
