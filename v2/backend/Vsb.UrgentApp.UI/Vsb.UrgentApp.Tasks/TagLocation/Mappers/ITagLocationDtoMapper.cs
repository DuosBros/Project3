using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Patient;

namespace Vsb.UrgentApp.Tasks.TagLocation.Mappers
{
	public interface ITagLocationDtoMapper : IMapper<Domain.DomainObjects.Entities.TagLocation, TagLocationDto>, IMapper<TagLocationDto, Domain.DomainObjects.Entities.TagLocation>
	{
	}
}
