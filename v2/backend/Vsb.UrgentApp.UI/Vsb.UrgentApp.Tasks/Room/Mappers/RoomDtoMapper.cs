using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Room;
using Vsb.UrgentApp.Tasks.Tag.Mappers;
using Vsb.UrgentApp.Tasks.TagLocation;
using Vsb.UrgentApp.Tasks.TagLocation.Mappers;
using Vsb.UrgentApp.Tasks.TagRegistration.Mappers;

namespace Vsb.UrgentApp.Tasks.Patient.Mappers
{
	public class RoomDtoMapper : IRoomDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool _initialized;
	    private readonly ITagRegistrationDtoMapper _tagRegistrationDtoMapper;
	    private readonly ITagDtoMapper _tagDtoMapper;


        public RoomDtoMapper(
		    ITagRegistrationDtoMapper tagRegistrationDtoMapper,
            ITagDtoMapper tagDtoMapper)
		{
		    this._tagRegistrationDtoMapper = Requires.IsNotNull(tagRegistrationDtoMapper, nameof(tagRegistrationDtoMapper));
		    this._tagDtoMapper = Requires.IsNotNull(tagDtoMapper, nameof(tagDtoMapper));
        }

		public RoomDto MapFrom(Domain.DomainObjects.Entities.Room input)
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
				throw new NullReferenceException("Room is not set!");
			}

			var result = (RoomDto)Mapper.Map(input, input.GetType(), typeof(RoomDto));

			return result;
		}

		public Domain.DomainObjects.Entities.Room MapFrom(RoomDto input)
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
				throw new NullReferenceException("RoomDto is not set!");
			}

			var result = (Domain.DomainObjects.Entities.Room)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.Room));

			return result;
		}

		private void CreateMap()
		{
			// From
		    Mapper.CreateMap<Domain.DomainObjects.Entities.Room, RoomDto>()
		        .IgnoreAllNonExisting();

            // To
		    Mapper.CreateMap<RoomDto, Domain.DomainObjects.Entities.Room>()
                .IgnoreAllNonExisting();

		}
	}

}
