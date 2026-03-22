using ProteinMutation.Domain.Enums;
using ProteinMutation.Domain.ValueObjects;

namespace ProteinMutation.Domain.Entities
{
    public sealed class ProteinVariant
    {
        // Primary identity
        public int Id { get; private set; }
        public string RawVariantId { get; private set; } = string.Empty;

        private ProteinVariantId? _variantId;
        public ProteinVariantId VariantId =>
            _variantId ??= ProteinVariantId.Parse(RawVariantId);

        // AlphaMissense scores
        public double AmPathogenicity { get; private set; }
        public AlphaMissenseClass AmClass { get; private set; }
        public bool AmLabel { get; private set; }

        // ESM1b scores
        public double Esm1bLlr { get; private set; }
        public EsmPathogenicityClass Esm1bIsPathogenic { get; private set; }

        // Stability
        public double? PredDdg { get; private set; }
        public bool PredDdgLabel { get; private set; }

        // Interface
        public double? InterfacePdockq { get; private set; }
        public bool InterfaceLabel { get; private set; }

        // Pocket
        public bool PocketLabel { get; private set; }

        // Mechanistic
        public MechanisticLabel MechanisticLabel { get; private set; }

        // EF Core constructor
        private ProteinVariant() { }

        public static ProteinVariant Create(
            ProteinVariantId variantId,
            double amPathogenicity,
            AlphaMissenseClass amClass,
            bool amLabel,
            double esm1bLlr,
            EsmPathogenicityClass esm1bIsPathogenic,
            double? predDdg,
            bool predDdgLabel,
            double? interfacePdockq,
            bool interfaceLabel,
            bool pocketLabel,
            MechanisticLabel mechanisticLabel)
        {
            return new ProteinVariant
            {
                RawVariantId = variantId.RawValue,
                AmPathogenicity = amPathogenicity,
                AmClass = amClass,
                AmLabel = amLabel,
                Esm1bLlr = esm1bLlr,
                Esm1bIsPathogenic = esm1bIsPathogenic,
                PredDdg = predDdg,
                PredDdgLabel = predDdgLabel,
                InterfacePdockq = interfacePdockq,
                InterfaceLabel = interfaceLabel,
                PocketLabel = pocketLabel,
                MechanisticLabel = mechanisticLabel
            };
        }
    }
}
