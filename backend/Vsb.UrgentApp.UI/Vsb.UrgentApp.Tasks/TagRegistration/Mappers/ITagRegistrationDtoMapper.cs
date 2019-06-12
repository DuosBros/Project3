using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.Tag;

namespace Vsb.UrgentApp.Tasks.TagRegistration.Mappers
{
	public interface ITagRegistrationDtoMapper : IMapper<Domain.DomainObjects.Entities.TagRegistration, TagRegistrationDto>, IMapper<TagRegistrationDto, Domain.DomainObjects.Entities.TagRegistration>
	{
	}
}
