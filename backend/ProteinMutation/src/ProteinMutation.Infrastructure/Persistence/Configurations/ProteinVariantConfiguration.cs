using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProteinMutation.Domain.Entities;
using ProteinMutation.Domain.Enums;

namespace ProteinMutation.Infrastructure.Persistence.Configurations
{
    public sealed class ProteinVariantConfiguration : IEntityTypeConfiguration<ProteinVariant>
    {
        public void Configure(EntityTypeBuilder<ProteinVariant> builder)
        {
            builder.ToTable("ProteinVariants");

            builder.HasKey(v => v.Id);

            builder.Property(v => v.Id)
                .ValueGeneratedOnAdd();

            builder.Property(v => v.RawVariantId)
                .HasColumnName("VariantId")
                .HasMaxLength(50)
                .IsRequired();

            builder.Ignore(v => v.VariantId);

            // Index on RawVariantId — not VariantId
            builder.HasIndex(v => v.RawVariantId)
                .IsUnique();

            // Shadow property for protein ID lookups
            builder.Property<string>("ProteinId")
                .HasColumnName("ProteinId")
                .HasMaxLength(20)
                .IsRequired();

            builder.HasIndex("ProteinId");

            // AlphaMissense
            builder.Property(v => v.AmPathogenicity)
                .HasColumnName("AmPathogenicity")
                .IsRequired();

            builder.Property(v => v.AmClass)
                .HasColumnName("AmClass")
                .HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<AlphaMissenseClass>(v))
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(v => v.AmLabel)
                .HasColumnName("AmLabel")
                .IsRequired();

            // ESM1b
            builder.Property(v => v.Esm1bLlr)
                .HasColumnName("Esm1bLlr")
                .IsRequired();

            builder.Property(v => v.Esm1bIsPathogenic)
                .HasColumnName("Esm1bIsPathogenic")
                .HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<EsmPathogenicityClass>(v))
                .HasMaxLength(20)
                .IsRequired();

            // Stability
            builder.Property(v => v.PredDdg)
                .HasColumnName("PredDdg")
                .IsRequired(false);

            builder.Property(v => v.PredDdgLabel)
                .HasColumnName("PredDdgLabel")
                .IsRequired();

            // Interface
            builder.Property(v => v.InterfacePdockq)
                .HasColumnName("InterfacePdockq")
                .IsRequired(false);

            builder.Property(v => v.InterfaceLabel)
                .HasColumnName("InterfaceLabel")
                .IsRequired();

            // Pocket
            builder.Property(v => v.PocketLabel)
                .HasColumnName("PocketLabel")
                .IsRequired();

            // Mechanistic
            builder.Property(v => v.MechanisticLabel)
                .HasColumnName("MechanisticLabel")
                .HasConversion(
                    v => v.ToString(),
                    v => Enum.Parse<MechanisticLabel>(v))
                .HasMaxLength(20)
                .IsRequired();
        }
    }
}
