using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Vsb.UrgentApp.Common.Mappers;
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

	    public Domain.DomainObjects.Entities.Tag MapFrom(TagDto input)
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

	        var result = (Domain.DomainObjects.Entities.Tag)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.Tag));

	        return result;
        }

		private void CreateMap()	
		{
			// From
			Mapper.CreateMap<Domain.DomainObjects.Entities.Tag, TagDto>()
				.ForMember(x => x.LastSeen,
					opt => opt.MapFrom(input => new DateTime(input.Last_Seen.Ticks, DateTimeKind.Utc)))
			    .ForMember(x => x.HWKey,
			        opt => opt.MapFrom(input => input.HW_Key));

            // To
            Mapper.CreateMap<TagDto, Domain.DomainObjects.Entities.Tag>()
		        .ForMember(x => x.HW_Key,
		            opt => opt.MapFrom(input => input.HWKey));

        }

	    public Domain.DomainObjects.Entities.TagRegistration MapFrom1(TagDto input)
	    {
	        var tag = MapFrom(input);
	        Domain.DomainObjects.Entities.TagRegistration tagRegistration =
	            new Domain.DomainObjects.Entities.TagRegistration
	            {
                    Tag = tag
	            };

            tagRegistration.Created = DateTime.UtcNow;
	        
	        return tagRegistration;
	    }
	}
}
