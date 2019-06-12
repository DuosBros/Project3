using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Tag.Mappers;
using Vsb.UrgentApp.Tasks.TagLocation;
using Vsb.UrgentApp.Tasks.TagLocation.Mappers;
using Vsb.UrgentApp.Tasks.TagRegistration.Mappers;

namespace Vsb.UrgentApp.Tasks.Patient.Mappers
{
	public class TagLocationDtoMapper : ITagLocationDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool _initialized;
	    private readonly ITagDtoMapper _tagDtoMapper;
	    private readonly IPatientDtoMapper _patientDtoMapper;
	    private readonly IRoomDtoMapper _roomDtoMapper;


        public TagLocationDtoMapper(
            ITagDtoMapper tagDtoMapper,
            IPatientDtoMapper patientDtoMapper,
            IRoomDtoMapper roomDtoMapper)
		{
		  
		    this._tagDtoMapper = Requires.IsNotNull(tagDtoMapper, nameof(tagDtoMapper));
		    this._patientDtoMapper = Requires.IsNotNull(patientDtoMapper, nameof(patientDtoMapper));
		    this._roomDtoMapper = Requires.IsNotNull(roomDtoMapper, nameof(roomDtoMapper));
        }

		public TagLocationDto MapFrom(Domain.DomainObjects.Entities.TagLocation input)
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
				throw new NullReferenceException("TagLocation is not set!");
			}

			var result = (TagLocationDto)Mapper.Map(input, input.GetType(), typeof(TagLocationDto));

			return result;
		}

		public Domain.DomainObjects.Entities.TagLocation MapFrom(TagLocationDto input)
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
				throw new NullReferenceException("TagLocationDto is not set!");
			}

			var result = (Domain.DomainObjects.Entities.TagLocation)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.TagLocation));

			return result;
		}

		private void CreateMap()
		{
			// From
		    Mapper.CreateMap<Domain.DomainObjects.Entities.TagLocation, TagLocationDto>()
		        .ForMember(x => x.Modified,
		            opt => opt.MapFrom(input =>
		                input.CreatedModified.HasValue
		                    ? new DateTime(input.CreatedModified.Value.Ticks, DateTimeKind.Utc)
		                    : (DateTime?) null))
		        .ForMember(x => x.Created,
		            opt => opt.MapFrom(input =>
		                    new DateTime(input.Created.Ticks, DateTimeKind.Utc)))
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
		        .ForMember(x => x.Room,
		            opt => opt.MapFrom(input =>
		                input.Room != null
		                    ? _roomDtoMapper.MapFrom(input.Room)
		                    : null))
                .IgnoreAllNonExisting();

            // To
		    Mapper.CreateMap<TagLocationDto, Domain.DomainObjects.Entities.TagLocation>()
                .IgnoreAllNonExisting();

		}
	}

}
