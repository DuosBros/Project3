using System;
using AutoMapper;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Patient.Mappers;
using Vsb.UrgentApp.Tasks.Tag.Mappers;
using Vsb.UrgentApp.Tasks.TagEvent;

namespace Vsb.UrgentApp.Tasks.TagEvent.Mappers
{
	public class TagEventDtoMapper : ITagEventDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool _initialized;
	    private readonly ITagDtoMapper _tagDtoMapper;
	    private readonly IPatientDtoMapper _patientDtoMapper;
	    private readonly ITagEventTypeDtoMapper _tagEventTypeDtoMapper;

        public TagEventDtoMapper(ITagDtoMapper tagDtoMapper, IPatientDtoMapper patientDtoMapper
        , ITagEventTypeDtoMapper tagEventTypeDtoMapper)
        {
            this._tagDtoMapper = Requires.IsNotNull(tagDtoMapper, nameof(tagDtoMapper));
            this._patientDtoMapper = Requires.IsNotNull(patientDtoMapper, nameof(patientDtoMapper));
            this._tagEventTypeDtoMapper = Requires.IsNotNull(tagEventTypeDtoMapper, nameof(tagEventTypeDtoMapper));
        }


        public TagEventDto MapFrom(Domain.DomainObjects.Entities.TagEvent input)
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

			var result = (TagEventDto)Mapper.Map(input, input.GetType(), typeof(TagEventDto));

			return result;
		}

		public Domain.DomainObjects.Entities.TagEvent MapFrom(TagEventDto input)
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
				throw new NullReferenceException("TagEventDto is not set!");
			}

			var result = (Domain.DomainObjects.Entities.TagEvent)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.TagEvent));

			return result;
		}

		private void CreateMap()
		{
			// From
		    Mapper.CreateMap<Domain.DomainObjects.Entities.TagEvent, TagEventDto>()
		        .ForMember(x => x.Created,
		            opt => opt.MapFrom(input => new DateTime(input.Created.Ticks, DateTimeKind.Utc)))
		        .ForMember(x => x.Modified,
		            opt => opt.MapFrom(input => new DateTime(input.Modified.Ticks, DateTimeKind.Utc)))
                .ForMember(x => x.Tag,
		            opt => opt.MapFrom(input =>
		                input.Tag != null
		                    ? _tagDtoMapper.MapFrom(input.Tag)
		                    : null))
		        .ForMember(x => x.Patient,
		            opt => opt.MapFrom(input =>
		                input.Patient != null
		                    ? _patientDtoMapper.MapFrom(input.Patient)
		                    : null))
		        .ForMember(x => x.TagEventType,
		            opt => opt.MapFrom(input =>
		                input.TagEventType != null
		                    ? _tagEventTypeDtoMapper.MapFrom(input.TagEventType)
		                    : null))
                .IgnoreAllNonExisting();

            // To
		    Mapper.CreateMap<TagEventDto, Domain.DomainObjects.Entities.TagEvent>()
		        .ForMember(x => x.Tag,
		            opt => opt.MapFrom(input =>
		                input.Tag != null
		                    ? _tagDtoMapper.MapFrom(input.Tag)
		                    : null))
		        .ForMember(x => x.Patient,
		            opt => opt.MapFrom(input =>
		                input.Patient != null
		                    ? _patientDtoMapper.MapFrom(input.Patient)
		                    : null))
		        .ForMember(x => x.TagEventType,
		            opt => opt.MapFrom(input =>
		                input.TagEventType != null
		                    ? _tagEventTypeDtoMapper.MapFrom(input.TagEventType)
		                    : null))
                .IgnoreAllNonExisting();

		}
	}

}
