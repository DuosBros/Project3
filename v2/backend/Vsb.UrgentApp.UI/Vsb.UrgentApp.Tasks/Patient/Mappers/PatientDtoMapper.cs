using AutoMapper;
using System;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Tag.Mappers;

namespace Vsb.UrgentApp.Tasks.Patient.Mappers
{
    public class PatientDtoMapper : IPatientDtoMapper
    {
        private static readonly object Sync = new object();
        private static bool _initialized;
        private readonly ITagDtoMapper _tagDtoMapper;


        public PatientDtoMapper(
            ITagDtoMapper tagDtoMapper)
        {
            this._tagDtoMapper = Requires.IsNotNull(tagDtoMapper, nameof(tagDtoMapper));
        }

        public PatientDto MapFrom(Domain.DomainObjects.Entities.Patient input)
        {
            if (!_initialized)
            {
                lock (Sync)
                {
                    if (!_initialized)
                    {
                        CreateMap();

                        _initialized = true;
                    }
                }
            }

            if (input == null)
            {
                throw new NullReferenceException("Patient is not set!");
            }

            var result = (PatientDto)Mapper.Map(input, input.GetType(), typeof(PatientDto));

            return result;
        }

        public Domain.DomainObjects.Entities.Patient MapFrom(PatientDto input)
        {
            if (!_initialized)
            {
                lock (Sync)
                {
                    if (!_initialized)
                    {
                        CreateMap();

                        _initialized = true;
                    }
                }
            }

            if (input == null)
            {
                throw new NullReferenceException("PatientDto is not set!");
            }

            var result = (Domain.DomainObjects.Entities.Patient)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.Patient));

            return result;
        }

        private void CreateMap()
        {
            // From
            Mapper.CreateMap<Domain.DomainObjects.Entities.Patient, PatientDto>()
                .ForMember(x => x.Deleted,
                    opt => opt.MapFrom(input =>
                        input.Deleted.HasValue
                            ? new DateTime(input.Deleted.Value.Ticks, DateTimeKind.Utc)
                            : (DateTime?)null))
                .ForMember(x => x.Created,
                    opt => opt.MapFrom(input =>
                        new DateTime(input.Created.Ticks, DateTimeKind.Utc)))
                .ForMember(x => x.Tag,
                    opt => opt.MapFrom(input =>
                        input.TagRegistration.Tag != null
                            ? _tagDtoMapper.MapFrom(input.TagRegistration.Tag)
                            : null))
                .ForMember(x => x.CardId, opt => opt.MapFrom(input => input.Card_Id))
                .ForMember(x => x.MiddleName, opt => opt.MapFrom(input => string.IsNullOrEmpty(input.MiddleName) ? string.Empty : input.MiddleName))
                .IgnoreAllNonExisting();

            // To
            Mapper.CreateMap<PatientDto, Domain.DomainObjects.Entities.Patient>()
                .ForMember(x => x.BirthDate,
                    opt => opt.MapFrom(input => string.IsNullOrEmpty(input.BirthDate) ? (DateTime?)null : Convert.ToDateTime(input.BirthDate)))
                .ForMember(x => x.Card_Id, opt => opt.MapFrom(input => input.CardId))
                .ForMember(x => x.Id, opt => opt.MapFrom(input => input.Id != 0 ? input.Id : 0))
                .ForMember(x => x.TagRegistration,
                    opt => opt.MapFrom(input =>
                        input.Tag != null
                            ? _tagDtoMapper.MapFrom1(input.Tag)
                            : null))
                .IgnoreAllNonExisting();

        }
    }

}
