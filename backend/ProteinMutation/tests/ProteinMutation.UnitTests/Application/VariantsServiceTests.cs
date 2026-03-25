using AutoMapper;
using FluentAssertions;
using NSubstitute;
using ProteinMutation.Application.DataTransferObjects;
using ProteinMutation.Application.Services;
using ProteinMutation.Domain.Entities;
using ProteinMutation.Domain.Enums;
using ProteinMutation.Domain.Exceptions;
using ProteinMutation.Domain.Repositories;
using ProteinMutation.Domain.ValueObjects;

namespace ProteinMutation.UnitTests.Application
{
    public sealed class VariantsServiceTests
    {
        private readonly IProteinVariantRepository _repository;
        private readonly IMapper _mapper;
        private readonly VariantsService _sut;

        public VariantsServiceTests()
        {
            _repository = Substitute.For<IProteinVariantRepository>();
            _mapper = Substitute.For<IMapper>();
            _sut = new VariantsService(_repository, _mapper);
        }

        #region GetByVariantIdAsync

        [Fact]
        public async Task GetByVariantIdAsync_ValidId_ReturnsDto()
        {
            // Arrange
            var variant = CreateVariant("Q7Z4H8/A126C");
            var dto = CreateDto("Q7Z4H8/A126C");

            _repository
                .GetByVariantIdAsync(Arg.Any<ProteinVariantId>(), Arg.Any<CancellationToken>())
                .Returns(variant);

            _mapper
                .Map<ProteinVariantDto>(variant)
                .Returns(dto);

            // Act
            var result = await _sut.GetByVariantIdAsync("Q7Z4H8/A126C");

            // Assert
            result.Should().NotBeNull();
            result.VariantId.Should().Be("Q7Z4H8/A126C");
        }

        [Fact]
        public async Task GetByVariantIdAsync_InvalidFormat_ThrowsInvalidVariantFormatException()
        {
            // Act
            var act = async () => await _sut.GetByVariantIdAsync("INVALID");

            // Assert
            await act.Should().ThrowAsync<InvalidVariantFormatException>();
        }

        [Fact]
        public async Task GetByVariantIdAsync_NotFound_ThrowsVariantNotFoundException()
        {
            // Arrange
            _repository
                .GetByVariantIdAsync(Arg.Any<ProteinVariantId>(), Arg.Any<CancellationToken>())
                .Returns((ProteinVariant?)null);

            // Act
            var act = async () => await _sut.GetByVariantIdAsync("Q7Z4H8/A126C");

            // Assert
            await act.Should().ThrowAsync<VariantNotFoundException>()
                .WithMessage("*Q7Z4H8/A126C*");
        }

        [Fact]
        public async Task GetByVariantIdAsync_AcceptsSpaceSeparatedFormat()
        {
            // Arrange
            var variant = CreateVariant("Q7Z4H8/A126C");
            var dto = CreateDto("Q7Z4H8/A126C");

            _repository
                .GetByVariantIdAsync(Arg.Any<ProteinVariantId>(), Arg.Any<CancellationToken>())
                .Returns(variant);

            _mapper.Map<ProteinVariantDto>(variant).Returns(dto);

            // Act — space separated format
            var act = async () => await _sut.GetByVariantIdAsync("Q7Z4H8 A126C");

            // Assert — should not throw
            await act.Should().NotThrowAsync();
        }

        #endregion

        #region GetByProteinIdAsync

        [Fact]
        public async Task GetByProteinIdAsync_ValidId_ReturnsVariants()
        {
            // Arrange
            var variants = new List<ProteinVariant>
        {
            CreateVariant("Q7Z4H8/A126C"),
            CreateVariant("Q7Z4H8/A126D"),
        };

            var dtos = new List<ProteinVariantDto>
        {
            CreateDto("Q7Z4H8/A126C"),
            CreateDto("Q7Z4H8/A126D"),
        };

            _repository
                .GetByProteinIdAsync("Q7Z4H8", Arg.Any<CancellationToken>())
                .Returns(variants);

            _mapper
                .Map<IReadOnlyList<ProteinVariantDto>>(variants)
                .Returns(dtos);

            // Act
            var result = await _sut.GetByProteinIdAsync("Q7Z4H8");

            // Assert
            result.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetByProteinIdAsync_NormalizesProteinIdToUppercase()
        {
            // Arrange
            _repository
                .GetByProteinIdAsync(Arg.Any<string>(), Arg.Any<CancellationToken>())
                .Returns(new List<ProteinVariant>());

            _mapper
                .Map<IReadOnlyList<ProteinVariantDto>>(Arg.Any<IReadOnlyList<ProteinVariant>>())
                .Returns(new List<ProteinVariantDto>());

            // Act
            await _sut.GetByProteinIdAsync("q7z4h8");

            // Assert — repository called with uppercase
            await _repository.Received(1)
                .GetByProteinIdAsync("Q7Z4H8", Arg.Any<CancellationToken>());
        }

        [Fact]
        public async Task GetByProteinIdAsync_EmptyProteinId_ThrowsInvalidVariantFormatException()
        {
            // Act
            var act = async () => await _sut.GetByProteinIdAsync(string.Empty);

            // Assert
            await act.Should().ThrowAsync<InvalidVariantFormatException>();
        }

        [Fact]
        public async Task GetByProteinIdAsync_WhitespaceProteinId_ThrowsInvalidVariantFormatException()
        {
            // Act
            var act = async () => await _sut.GetByProteinIdAsync("   ");

            // Assert
            await act.Should().ThrowAsync<InvalidVariantFormatException>();
        }

        #endregion

        #region ProcessBatchAsync

        [Fact]
        public async Task ProcessBatchAsync_ValidLines_ReturnFoundVariants()
        {
            // Arrange
            var lines = new[] { "Q7Z4H8/A126C", "Q7Z4H8/A126D" };
            var variants = new List<ProteinVariant>
        {
            CreateVariant("Q7Z4H8/A126C"),
            CreateVariant("Q7Z4H8/A126D"),
        };

            var dtos = new List<ProteinVariantDto>
        {
            CreateDto("Q7Z4H8/A126C"),
            CreateDto("Q7Z4H8/A126D"),
        };

            _repository
                .GetByVariantIdsAsync(Arg.Any<IEnumerable<ProteinVariantId>>(), Arg.Any<CancellationToken>())
                .Returns(variants);

            _mapper
                .Map<IReadOnlyList<ProteinVariantDto>>(variants)
                .Returns(dtos);

            // Act
            var result = await _sut.ProcessBatchAsync(lines);

            // Assert
            result.Found.Should().HaveCount(2);
            result.NotFound.Should().BeEmpty();
            result.Invalid.Should().BeEmpty();
        }

        [Fact]
        public async Task ProcessBatchAsync_InvalidLines_ReturnsInvalidEntries()
        {
            // Arrange
            var lines = new[] { "INVALID_LINE", "ALSO_INVALID" };

            // Act
            var result = await _sut.ProcessBatchAsync(lines);

            // Assert
            result.Invalid.Should().HaveCount(2);
            result.Found.Should().BeEmpty();
            result.NotFound.Should().BeEmpty();
        }

        [Fact]
        public async Task ProcessBatchAsync_MixedLines_CorrectlyBucketsResults()
        {
            // Arrange
            var lines = new[] { "Q7Z4H8/A126C", "P12235/G999Z", "INVALID" };

            // Q7Z4H8/A126C found, P12235/G999Z valid but not in DB, INVALID bad format
            var foundVariants = new List<ProteinVariant>
        {
            CreateVariant("Q7Z4H8/A126C"),
        };

            var foundDtos = new List<ProteinVariantDto>
        {
            CreateDto("Q7Z4H8/A126C"),
        };

            _repository
                .GetByVariantIdsAsync(Arg.Any<IEnumerable<ProteinVariantId>>(), Arg.Any<CancellationToken>())
                .Returns(foundVariants);

            _mapper
                .Map<IReadOnlyList<ProteinVariantDto>>(foundVariants)
                .Returns(foundDtos);

            // Act
            var result = await _sut.ProcessBatchAsync(lines);

            // Assert
            result.Found.Should().HaveCount(1);
            result.NotFound.Should().HaveCount(1);
            result.NotFound[0].Should().Be("P12235/G999Z");
            result.Invalid.Should().HaveCount(1);
            result.Invalid[0].Input.Should().Be("INVALID");
        }

        [Fact]
        public async Task ProcessBatchAsync_EmptyInput_ThrowsInvalidVariantFormatException()
        {
            // Act
            var act = async () => await _sut.ProcessBatchAsync(Array.Empty<string>());

            // Assert
            await act.Should().ThrowAsync<InvalidVariantFormatException>();
        }

        [Fact]
        public async Task ProcessBatchAsync_WhitespaceOnlyLines_ThrowsInvalidVariantFormatException()
        {
            // Act
            var act = async () => await _sut.ProcessBatchAsync(new[] { "   ", "" });

            // Assert
            await act.Should().ThrowAsync<InvalidVariantFormatException>();
        }

        [Fact]
        public async Task ProcessBatchAsync_AcceptsSpaceSeparatedFormat()
        {
            // Arrange
            var lines = new[] { "Q7Z4H8 A126C" };

            _repository
                .GetByVariantIdsAsync(Arg.Any<IEnumerable<ProteinVariantId>>(), Arg.Any<CancellationToken>())
                .Returns(new List<ProteinVariant>());

            _mapper
                .Map<IReadOnlyList<ProteinVariantDto>>(Arg.Any<IReadOnlyList<ProteinVariant>>())
                .Returns(new List<ProteinVariantDto>());

            // Act
            var result = await _sut.ProcessBatchAsync(lines);

            // Assert — normalized to slash format in notFound
            result.Invalid.Should().BeEmpty();
        }

        [Fact]
        public async Task ProcessBatchAsync_DuplicateLines_OnlyLooksUpOnce()
        {
            // Arrange
            var lines = new[] { "Q7Z4H8/A126C", "Q7Z4H8/A126C" };

            _repository
                .GetByVariantIdsAsync(Arg.Any<IEnumerable<ProteinVariantId>>(), Arg.Any<CancellationToken>())
                .Returns(new List<ProteinVariant>());

            _mapper
                .Map<IReadOnlyList<ProteinVariantDto>>(Arg.Any<IReadOnlyList<ProteinVariant>>())
                .Returns(new List<ProteinVariantDto>());

            // Act
            await _sut.ProcessBatchAsync(lines);

            // Assert — repository called once with deduplicated IDs
            await _repository.Received(1)
                .GetByVariantIdsAsync(
                    Arg.Is<IEnumerable<ProteinVariantId>>(ids => ids.Count() == 1),
                    Arg.Any<CancellationToken>());
        }

        #endregion

        #region Helpers

        private static ProteinVariant CreateVariant(string rawId)
        {
            var variantId = ProteinVariantId.Parse(rawId);
            return ProteinVariant.Create(
                variantId,
                amPathogenicity: 0.6158,
                amClass: AlphaMissenseClass.Pathogenic,
                amLabel: true,
                esm1bLlr: -10.388,
                esm1bIsPathogenic: EsmPathogenicityClass.Pathogenic,
                predDdg: -0.353881,
                predDdgLabel: false,
                interfacePdockq: null,
                interfaceLabel: false,
                pocketLabel: false,
                mechanisticLabel: MechanisticLabel.Unassigned
            );
        }

        private static ProteinVariantDto CreateDto(string variantId) =>
            new(
                VariantId: variantId,
                ProteinId: variantId.Split('/')[0],
                FromAminoAcid: 'A',
                Position: 126,
                ToAminoAcid: 'C',
                AmPathogenicity: 0.6158,
                AmClass: AlphaMissenseClass.Pathogenic.ToString(),
                AmLabel: true,
                Esm1bLlr: -10.388,
                Esm1bIsPathogenic: EsmPathogenicityClass.Pathogenic.ToString(),
                PredDdg: -0.353881,
                PredDdgLabel: false,
                InterfacePdockq: null,
                InterfaceLabel: false,
                PocketLabel: false,
                MechanisticLabel: MechanisticLabel.Unassigned.ToString()
            );

        #endregion
    }
}
