
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.TagEventType;

namespace Vsb.UrgentApp.Tasks.Patient.Mappers
{
	public interface ITagEventTypeDtoMapper : IMapper<Domain.DomainObjects.Entities.TagEventType, TagEventTypeDto>, IMapper<TagEventTypeDto, Domain.DomainObjects.Entities.TagEventType>
	{
	}
}
