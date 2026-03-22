namespace ProteinMutation.Application.DataTransferObjects
{
    public sealed record BatchSubmissionResult(
        IReadOnlyList<ProteinVariantDto> Found,
        IReadOnlyList<string> NotFound,
        IReadOnlyList<InvalidVariantEntry> Invalid
    );

    public sealed record InvalidVariantEntry(
        string Input,
        string Reason
    );
}
