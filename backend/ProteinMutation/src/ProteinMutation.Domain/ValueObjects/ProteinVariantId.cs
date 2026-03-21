using ProteinMutation.Domain.Exceptions;
using System.Text.RegularExpressions;

namespace ProteinMutation.Domain.ValueObjects
{
    public sealed record ProteinVariantId
    {
        private static readonly Regex MutationPattern =
            new(@"^([A-Z])(\d+)([A-Z])$", RegexOptions.Compiled);

        public string ProteinId { get; }
        public char FromAminoAcid { get; }
        public int Position { get; }
        public char ToAminoAcid { get; }
        public string RawValue { get; }

        private ProteinVariantId(string proteinId, char fromAminoAcid, int position, char toAminoAcid, string rawValue)
        {
            ProteinId = proteinId;
            FromAminoAcid = fromAminoAcid;
            Position = position;
            ToAminoAcid = toAminoAcid;
            RawValue = rawValue;
        }

        /// <summary>
        /// Parses a variant ID in the format "Q7Z4H8/A126C"
        /// </summary>
        public static ProteinVariantId Parse(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new InvalidVariantFormatException(value, "Variant ID cannot be empty.");

            var parts = value.Trim().Split('/');

            if (parts.Length != 2)
                throw new InvalidVariantFormatException(value,
                    "Expected format: {ProteinId}/{FromAA}{Position}{ToAA} (e.g. Q7Z4H8/A126C).");

            var proteinId = parts[0].Trim().ToUpperInvariant();
            var mutation = parts[1].Trim().ToUpperInvariant();

            if (string.IsNullOrEmpty(proteinId))
                throw new InvalidVariantFormatException(value, "Protein ID cannot be empty.");

            var match = MutationPattern.Match(mutation);
            if (!match.Success)
                throw new InvalidVariantFormatException(value,
                    $"Mutation '{mutation}' is not valid. Expected format: [A-Z][position][A-Z] (e.g. A126C).");

            return new ProteinVariantId(
                proteinId,
                match.Groups[1].Value[0],
                int.Parse(match.Groups[2].Value),
                match.Groups[3].Value[0],
                $"{proteinId}/{mutation}"
            );
        }

        /// <summary>
        /// Parses a variant in the alternative space-separated format "Q7Z4H8 A126C"
        /// and normalizes it to the canonical slash format.
        /// </summary>
        public static ProteinVariantId ParseSpaceSeparated(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new InvalidVariantFormatException(value, "Variant ID cannot be empty.");

            var parts = value.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length != 2)
                throw new InvalidVariantFormatException(value,
                    "Expected format: {ProteinId} {FromAA}{Position}{ToAA} (e.g. Q7Z4H8 A126C).");

            return Parse($"{parts[0]}/{parts[1]}");
        }

        public static bool TryParse(string value, out ProteinVariantId? result)
        {
            try
            {
                result = Parse(value);
                return true;
            }
            catch
            {
                result = null;
                return false;
            }
        }

        public override string ToString() => RawValue;

        //public override bool Equals(object? obj) => Equals(obj as ProteinVariantId);

        public bool Equals(ProteinVariantId? other)
        {
            if (other is null)
            {
                return false;
            }

            return string.Equals(ProteinId, other.ProteinId, StringComparison.OrdinalIgnoreCase)
                   && FromAminoAcid == other.FromAminoAcid
                   && Position == other.Position
                   && ToAminoAcid == other.ToAminoAcid;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(
                ProteinId.ToUpperInvariant(),
                FromAminoAcid,
                Position,
                ToAminoAcid);
        }
    }
}
