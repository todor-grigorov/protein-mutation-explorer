using AutoMapper;
using ProteinMutation.Application.DataTransferObjects;
using ProteinMutation.Domain.Entities;

namespace ProteinMutation.Api
{
    public sealed class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<ProteinVariant, ProteinVariantDto>()
                .ForMember(dest => dest.VariantId,
                    opt => opt.MapFrom(src => src.VariantId.RawValue))
                .ForMember(dest => dest.ProteinId,
                    opt => opt.MapFrom(src => src.VariantId.ProteinId))
                .ForMember(dest => dest.FromAminoAcid,
                    opt => opt.MapFrom(src => src.VariantId.FromAminoAcid))
                .ForMember(dest => dest.Position,
                    opt => opt.MapFrom(src => src.VariantId.Position))
                .ForMember(dest => dest.ToAminoAcid,
                    opt => opt.MapFrom(src => src.VariantId.ToAminoAcid));

            CreateMap<string, ProteinDto>()
                .ConstructUsing(src => new ProteinDto(src));
        }
    }
}
