using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Common.Mappers;

namespace Vsb.UrgentApp.Tasks.User.Mappers
{
	public interface IUserDtoMapper : IMapper<Domain.DomainObjects.Entities.User, UserDto>
	{
	}
}
