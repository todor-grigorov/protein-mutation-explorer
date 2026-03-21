namespace ProteinMutation.Domain.Exceptions
{
    public sealed class InvalidVariantFormatException : DomainException
    {
        public string AttemptedValue { get; }

        public InvalidVariantFormatException(string attemptedValue, string reason)
            : base($"'{attemptedValue}' is not a valid variant ID. {reason}")
        {
            AttemptedValue = attemptedValue;
        }
    }
}
