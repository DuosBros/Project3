using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.Patient.Mappers;
using Vsb.UrgentApp.Tasks.Tag.Mappers;

namespace Vsb.UrgentApp.Tasks.TagRegistration.Mappers
{
	public class TagRegistrationDtoMapper : ITagRegistrationDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool initialized;
	    private readonly ITagDtoMapper _tagDtoMapper;
	    private readonly IPatientDtoMapper _patientDtoMapper;

        public TagRegistrationDtoMapper(ITagDtoMapper tagDtoMapper, IPatientDtoMapper patientDtoMapper)
	    {
	        this._tagDtoMapper = Requires.IsNotNull(tagDtoMapper, nameof(tagDtoMapper));
	        this._patientDtoMapper = Requires.IsNotNull(patientDtoMapper, nameof(patientDtoMapper));
        }

       
        public Domain.DomainObjects.Entities.TagRegistration MapFrom(TagRegistrationDto input)
		{
			if (!initialized)
			{
				lock (Sync)
				{
					if (!initialized)
					{
						CreateMap();

						initialized = true;
					}
				}
			}

			if (input == null)
			{
				throw new NullReferenceException("TagRegistrationDto is not set!");
			}

			var result = (Domain.DomainObjects.Entities.TagRegistration)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.TagRegistration));

			return result;
		}
        
		public TagRegistrationDto MapFrom(Domain.DomainObjects.Entities.TagRegistration input)
		{
			if (!initialized)
			{
				lock (Sync)
				{
					if (!initialized)
					{
						CreateMap();

						initialized = true;
					}
				}
			}

			if (input == null)
			{
				throw new NullReferenceException("TagRegistration is not set!");
			}

			var result = (TagRegistrationDto)Mapper.Map(input, input.GetType(), typeof(TagRegistrationDto));

			return result;
		}

		private void CreateMap()
		{
			// From
		    Mapper.CreateMap<Domain.DomainObjects.Entities.TagRegistration, TagRegistrationDto>()
		        .ForMember(x => x.Created,
		            opt => opt.MapFrom(input => new DateTime(input.Created.Ticks, DateTimeKind.Utc)))
		        .ForMember(x => x.Tag,
		            opt => opt.MapFrom(input =>
		                input.Tag != null
		                    ? _tagDtoMapper.MapFrom(input.Tag)
		                    : null))
		        .ForMember(x => x.Patient,
		            opt => opt.MapFrom(input =>
		                input.Patient != null
		                    ? _patientDtoMapper.MapFrom(input.Patient)
		                    : null));

            Mapper.CreateMap<TagRegistrationDto, Domain.DomainObjects.Entities.TagRegistration>()
                .ForMember(x => x.Tag,
                    opt => opt.MapFrom(input =>
                        input.Tag != null
                            ? _tagDtoMapper.MapFrom(input.Tag)
                            : null))
                .ForMember(x => x.Patient,
                    opt => opt.MapFrom(input =>
                        input.Patient != null
                            ? _patientDtoMapper.MapFrom(input.Patient)
                            : null));

        }
	}
}
