using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Vsb.UrgentApp.Tasks.Patient;

namespace Vsb.UrgentApp.Tasks.Tag.Mappers
{
	public class TagDtoMapper : ITagDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool initialized;
		
		public TagDto MapFrom(Domain.DomainObjects.Entities.Tag input)
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
				throw new NullReferenceException("Tag is not set!");
			}

			var result = (TagDto)Mapper.Map(input, input.GetType(), typeof(TagDto));

			return result;
		}

		private void CreateMap()	
		{
			// From
			Mapper.CreateMap<Domain.DomainObjects.Entities.Tag, TagDto>()
				.ForMember(x => x.Last_Seen,
					opt => opt.MapFrom(input => new DateTime(input.Last_Seen.Ticks, DateTimeKind.Utc)));

		}
	}
}
