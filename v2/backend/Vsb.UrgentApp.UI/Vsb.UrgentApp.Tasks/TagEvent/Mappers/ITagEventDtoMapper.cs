using Vsb.UrgentApp.Common.Mappers;

namespace Vsb.UrgentApp.Tasks.TagEvent.Mappers
{
	public interface ITagEventDtoMapper : IMapper<Domain.DomainObjects.Entities.TagEvent, TagEventDto>, IMapper<TagEventDto, Domain.DomainObjects.Entities.TagEvent>
	{
	}
}
