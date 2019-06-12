using System;
using AutoMapper;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Patient.Mappers;

namespace Vsb.UrgentApp.Tasks.TagEventType.Mappers
{
	public class TagEventTypeDtoMapper : ITagEventTypeDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool _initialized;

		public TagEventTypeDto MapFrom(Domain.DomainObjects.Entities.TagEventType input)
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

			var result = (TagEventTypeDto)Mapper.Map(input, input.GetType(), typeof(TagEventTypeDto));

			return result;
		}

		public Domain.DomainObjects.Entities.TagEventType MapFrom(TagEventTypeDto input)
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
				throw new NullReferenceException("TagEventTypeDto is not set!");
			}

			var result = (Domain.DomainObjects.Entities.TagEventType)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.TagEventType));

			return result;
		}

		private void CreateMap()
		{
			// From
		    Mapper.CreateMap<Domain.DomainObjects.Entities.TagEventType, TagEventTypeDto>()
		        .ForMember(x => x.HWKey,
		            opt => opt.MapFrom(input => input.HW_Key))
		        .IgnoreAllNonExisting();

            // To
		    Mapper.CreateMap<TagEventTypeDto, Domain.DomainObjects.Entities.TagEventType>()
                .IgnoreAllNonExisting()
		        .ForMember(x => x.HW_Key,
		            opt => opt.MapFrom(input => input.HWKey));

        }
	}

}
