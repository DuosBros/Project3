using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Common.Mappers;

namespace Vsb.UrgentApp.Tasks.Tag.Mappers
{
	public interface ITagDtoMapper : IMapper<Domain.DomainObjects.Entities.Tag, TagDto>, IMapper<TagDto, Domain.DomainObjects.Entities.Tag>
	{
	    Domain.DomainObjects.Entities.TagRegistration MapFrom1(TagDto input);

	}
}
