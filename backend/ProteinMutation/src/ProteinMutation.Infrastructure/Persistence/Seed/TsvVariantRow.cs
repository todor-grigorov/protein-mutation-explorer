using CsvHelper.Configuration.Attributes;

namespace ProteinMutation.Infrastructure.Persistence.Seed
{
    public sealed class TsvVariantRow
    {
        [Name("variant_id")]
        public string VariantId { get; init; } = string.Empty;

        [Name("am_pathogenicity")]
        public double AmPathogenicity { get; init; }

        [Name("am_class")]
        public string AmClass { get; init; } = string.Empty;

        [Name("am_label")]
        public bool AmLabel { get; init; }

        [Name("ESM1b_LLR")]
        public double Esm1bLlr { get; init; }

        [Name("ESM1b_is_pathogenic")]
        public string Esm1bIsPathogenic { get; init; } = string.Empty;

        [Name("pred_ddg")]
        public string PredDdg { get; init; } = string.Empty;

        [Name("pred_ddg_label")]
        public bool PredDdgLabel { get; init; }

        [Name("interface_pdockq")]
        public string InterfacePdockq { get; init; } = string.Empty;

        [Name("interface_label")]
        public bool InterfaceLabel { get; init; }

        [Name("pocket_label")]
        public bool PocketLabel { get; init; }

        [Name("mechanistic_label")]
        public string MechanisticLabel { get; init; } = string.Empty;
    }
}
