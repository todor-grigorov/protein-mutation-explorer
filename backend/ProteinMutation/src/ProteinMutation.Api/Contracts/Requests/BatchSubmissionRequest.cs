namespace ProteinMutation.Api.Contracts.Requests
{
    public sealed record BatchSubmissionRequest(IEnumerable<string> Variants);
}
