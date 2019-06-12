using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace Vsb.UrgentApp.Tasks.TagRegistration.Mappers
{
	public class TagRegistrationDtoMapper : ITagRegistrationDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool initialized;

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
				.ForMember(x => x.Created, opt => opt.MapFrom(input => new DateTime(input.Created.Ticks, DateTimeKind.Utc)));

			Mapper.CreateMap<TagRegistrationDto, Domain.DomainObjects.Entities.TagRegistration>();

		}
	}
}
