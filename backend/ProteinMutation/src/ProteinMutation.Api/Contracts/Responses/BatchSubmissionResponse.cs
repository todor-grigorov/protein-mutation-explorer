namespace ProteinMutation.Api.Contracts.Responses
{
    public sealed record BatchSubmissionResponse(
        IReadOnlyList<ProteinVariantResponse> Found,
        IReadOnlyList<string> NotFound,
        IReadOnlyList<InvalidVariantResponse> Invalid
    );

    public sealed record InvalidVariantResponse(
        string Input,
        string Reason
    );
}
