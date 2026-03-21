namespace ProteinMutation.Domain.Exceptions
{
    public sealed class VariantNotFoundException : DomainException
    {
        public string VariantId { get; }

        public VariantNotFoundException(string variantId)
            : base($"Variant '{variantId}' was not found.")
        {
            VariantId = variantId;
        }
    }
}
