using AutoMapper;
using ProteinMutation.Api.Contracts.Responses;
using ProteinMutation.Application.DataTransferObjects;
using ProteinMutation.Domain.Entities;

namespace ProteinMutation.Api
{
    public sealed class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            // Domain → Application DTO
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

            // Application DTO → API Response
            CreateMap<ProteinVariantDto, ProteinVariantResponse>()
                .ForMember(dest => dest.AmClass,
                    opt => opt.MapFrom(src => src.AmClass.ToString()))
                .ForMember(dest => dest.Esm1bIsPathogenic,
                    opt => opt.MapFrom(src => src.Esm1bIsPathogenic.ToString()))
                .ForMember(dest => dest.MechanisticLabel,
                    opt => opt.MapFrom(src => src.MechanisticLabel.ToString()));

            // string → ProteinDto
            CreateMap<string, ProteinDto>()
                .ConstructUsing(src => new ProteinDto(src));

            // ProteinDto → ProteinResponse
            CreateMap<ProteinDto, ProteinResponse>();

            // InvalidVariantEntry → InvalidVariantResponse
            CreateMap<InvalidVariantEntry, InvalidVariantResponse>();

            // BatchSubmissionResult → BatchSubmissionResponse
            CreateMap<BatchSubmissionResult, BatchSubmissionResponse>()
                .ForMember(dest => dest.Found,
                    opt => opt.MapFrom(src => src.Found))
                .ForMember(dest => dest.NotFound,
                    opt => opt.MapFrom(src => src.NotFound))
                .ForMember(dest => dest.Invalid,
                    opt => opt.MapFrom(src => src.Invalid));
        }
    }
}
