namespace ProteinMutation.Application.DataTransferObjects
{
    public sealed record ProteinVariantDto(
    string VariantId,
    string ProteinId,
    char FromAminoAcid,
    int Position,
    char ToAminoAcid,

    // AlphaMissense
    double AmPathogenicity,
    string AmClass,
    bool AmLabel,

    // ESM1b
    double Esm1bLlr,
    string Esm1bIsPathogenic,

    // Stability
    double? PredDdg,
    bool PredDdgLabel,

    // Interface
    double? InterfacePdockq,
    bool InterfaceLabel,

    // Pocket
    bool PocketLabel,

    // Mechanistic
    string MechanisticLabel
);
}
