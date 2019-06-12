using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Room;

namespace Vsb.UrgentApp.Tasks.TagLocation.Mappers
{
	public interface IRoomDtoMapper : IMapper<Domain.DomainObjects.Entities.Room, RoomDto>, IMapper<RoomDto, Domain.DomainObjects.Entities.Room>
	{
	}
}
