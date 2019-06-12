using System.Collections.Generic;
using System.Linq;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Domain.Specifications;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Room;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.TagLocation.Mappers;

namespace Vsb.UrgentApp.Tasks.TagLocation
{
	public class TagLocationTasks : ITagLocationTasks
	{
		private readonly ITagLocationRepository _tagLocationRepository;
	    private readonly ITagLocationDtoMapper _tagLocationDtoMapper;

        public TagLocationTasks(
			ITagLocationRepository tagLocationRepository,
            ITagLocationDtoMapper tagLocationDtoMapper)
		{

			this._tagLocationRepository = Requires.IsNotNull(tagLocationRepository, nameof(tagLocationRepository));
		    this._tagLocationDtoMapper = Requires.IsNotNull(tagLocationDtoMapper, nameof(tagLocationDtoMapper));
        }

		public List<TagLocationDto> GetAll()
		{
		    var result = _tagLocationRepository.GetAll();

		    List<TagLocationDto> tagLocations = result.MapAllUsing<Domain.DomainObjects.Entities.TagLocation, TagLocationDto>(_tagLocationDtoMapper).ToList();

			return tagLocations;
		}

	    public TagLocationDto GetOne(int id)
	    {
	        var result = _tagLocationRepository.Get(id);

	        TagLocationDto tagLocation = _tagLocationDtoMapper.MapFrom(result);

	        return tagLocation;
	    }

	    public List<TagLocationDto> GetTagLocationsByTagId(int tagId)
	    {
	        var result = _tagLocationRepository.FindAll(new TagLocationByTagId(tagId)).ToList();

	        List<TagLocationDto> tagLocations = result.MapAllUsing<Domain.DomainObjects.Entities.TagLocation, TagLocationDto>(_tagLocationDtoMapper).ToList();

	        return tagLocations;
	    }

        public TagLocationDto GetPatientLocations(int patientId)
	    {
	        var result = _tagLocationRepository.FindAll(new TagLocationByPatientId(patientId))
            .OrderByDescending(x => x.Created)
            .ToList().FirstOrDefault();

            if (result != null)
	        {
	            return _tagLocationDtoMapper.MapFrom(result);
            }

	        return null;
	    }
    }
}
