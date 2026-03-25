using FluentAssertions;
using ProteinMutation.Domain.Exceptions;
using ProteinMutation.Domain.ValueObjects;

namespace ProteinMutation.UnitTests.Domain
{
    public sealed class ProteinVariantIdTests
    {
        #region Parse — valid inputs

        [Fact]
        public void Parse_ValidSlashFormat_ReturnsCorrectComponents()
        {
            var result = ProteinVariantId.Parse("Q7Z4H8/A126C");

            result.ProteinId.Should().Be("Q7Z4H8");
            result.FromAminoAcid.Should().Be('A');
            result.Position.Should().Be(126);
            result.ToAminoAcid.Should().Be('C');
            result.RawValue.Should().Be("Q7Z4H8/A126C");
        }

        [Fact]
        public void Parse_LowercaseInput_NormalizesToUppercase()
        {
            var result = ProteinVariantId.Parse("q7z4h8/a126c");

            result.ProteinId.Should().Be("Q7Z4H8");
            result.FromAminoAcid.Should().Be('A');
            result.Position.Should().Be(126);
            result.ToAminoAcid.Should().Be('C');
        }

        [Fact]
        public void Parse_InputWithWhitespace_TrimsCorrectly()
        {
            var result = ProteinVariantId.Parse("  Q7Z4H8/A126C  ");

            result.ProteinId.Should().Be("Q7Z4H8");
            result.RawValue.Should().Be("Q7Z4H8/A126C");
        }

        [Fact]
        public void Parse_ValidInput_RawValueIsCanonicalFormat()
        {
            var result = ProteinVariantId.Parse("Q7Z4H8/A126C");

            result.RawValue.Should().Be("Q7Z4H8/A126C");
            result.ToString().Should().Be("Q7Z4H8/A126C");
        }

        [Theory]
        [InlineData("P12235/G100A", "P12235", 'G', 100, 'A')]
        [InlineData("Q8IUR5/A100C", "Q8IUR5", 'A', 100, 'C')]
        [InlineData("Q7Z4H8/A126D", "Q7Z4H8", 'A', 126, 'D')]
        public void Parse_MultipleValidVariants_ParsesCorrectly(
            string input,
            string expectedProteinId,
            char expectedFrom,
            int expectedPosition,
            char expectedTo)
        {
            var result = ProteinVariantId.Parse(input);

            result.ProteinId.Should().Be(expectedProteinId);
            result.FromAminoAcid.Should().Be(expectedFrom);
            result.Position.Should().Be(expectedPosition);
            result.ToAminoAcid.Should().Be(expectedTo);
        }

        #endregion

        #region Parse — invalid inputs

        [Fact]
        public void Parse_EmptyString_ThrowsInvalidVariantFormatException()
        {
            var act = () => ProteinVariantId.Parse(string.Empty);

            act.Should().Throw<InvalidVariantFormatException>()
                .WithMessage("*cannot be empty*");
        }

        [Fact]
        public void Parse_WhitespaceOnly_ThrowsInvalidVariantFormatException()
        {
            var act = () => ProteinVariantId.Parse("   ");

            act.Should().Throw<InvalidVariantFormatException>();
        }

        [Fact]
        public void Parse_MissingSlash_ThrowsInvalidVariantFormatException()
        {
            var act = () => ProteinVariantId.Parse("Q7Z4H8A126C");

            act.Should().Throw<InvalidVariantFormatException>()
                .WithMessage("*Expected format*");
        }

        [Fact]
        public void Parse_InvalidMutationFormat_ThrowsInvalidVariantFormatException()
        {
            var act = () => ProteinVariantId.Parse("Q7Z4H8/126C");

            act.Should().Throw<InvalidVariantFormatException>()
                .WithMessage("*not valid*");
        }

        [Fact]
        public void Parse_EmptyProteinId_ThrowsInvalidVariantFormatException()
        {
            var act = () => ProteinVariantId.Parse("/A126C");

            act.Should().Throw<InvalidVariantFormatException>();
        }

        [Theory]
        [InlineData("Q7Z4H8/A126")]      // missing to AA
        [InlineData("Q7Z4H8/126C")]      // missing from AA
        [InlineData("Q7Z4H8/AC")]        // missing position
        [InlineData("Q7Z4H8/AAAA")]      // no position at all
        public void Parse_InvalidMutationPatterns_ThrowsInvalidVariantFormatException(
            string input)
        {
            var act = () => ProteinVariantId.Parse(input);

            act.Should().Throw<InvalidVariantFormatException>();
        }

        #endregion

        #region ParseSpaceSeparated

        [Fact]
        public void ParseSpaceSeparated_ValidInput_ReturnsCorrectComponents()
        {
            var result = ProteinVariantId.ParseSpaceSeparated("Q7Z4H8 A126C");

            result.ProteinId.Should().Be("Q7Z4H8");
            result.FromAminoAcid.Should().Be('A');
            result.Position.Should().Be(126);
            result.ToAminoAcid.Should().Be('C');
        }

        [Fact]
        public void ParseSpaceSeparated_ProducesCanonicalSlashFormat()
        {
            var result = ProteinVariantId.ParseSpaceSeparated("Q7Z4H8 A126C");

            result.RawValue.Should().Be("Q7Z4H8/A126C");
        }

        [Fact]
        public void ParseSpaceSeparated_EmptyString_ThrowsInvalidVariantFormatException()
        {
            var act = () => ProteinVariantId.ParseSpaceSeparated(string.Empty);

            act.Should().Throw<InvalidVariantFormatException>();
        }

        [Fact]
        public void ParseSpaceSeparated_TooManyParts_ThrowsInvalidVariantFormatException()
        {
            var act = () => ProteinVariantId.ParseSpaceSeparated("Q7Z4H8 A126C extra");

            act.Should().Throw<InvalidVariantFormatException>();
        }

        #endregion

        #region TryParse

        [Fact]
        public void TryParse_ValidInput_ReturnsTrueAndResult()
        {
            var success = ProteinVariantId.TryParse("Q7Z4H8/A126C", out var result);

            success.Should().BeTrue();
            result.Should().NotBeNull();
            result!.ProteinId.Should().Be("Q7Z4H8");
        }

        [Fact]
        public void TryParse_InvalidInput_ReturnsFalseAndNullResult()
        {
            var success = ProteinVariantId.TryParse("INVALID", out var result);

            success.Should().BeFalse();
            result.Should().BeNull();
        }

        [Fact]
        public void TryParse_EmptyString_ReturnsFalseAndNullResult()
        {
            var success = ProteinVariantId.TryParse(string.Empty, out var result);

            success.Should().BeFalse();
            result.Should().BeNull();
        }

        #endregion

        #region Equality

        [Fact]
        public void TwoVariantIds_WithSameValue_AreEqual()
        {
            var a = ProteinVariantId.Parse("Q7Z4H8/A126C");
            var b = ProteinVariantId.Parse("Q7Z4H8/A126C");

            a.Should().Be(b);
        }

        [Fact]
        public void TwoVariantIds_WithDifferentValues_AreNotEqual()
        {
            var a = ProteinVariantId.Parse("Q7Z4H8/A126C");
            var b = ProteinVariantId.Parse("Q7Z4H8/A126D");

            a.Should().NotBe(b);
        }

        #endregion
    }
}
