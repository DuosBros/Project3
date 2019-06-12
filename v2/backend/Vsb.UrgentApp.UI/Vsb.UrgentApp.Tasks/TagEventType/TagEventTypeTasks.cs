
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Infrastructure.Db;
using Vsb.UrgentApp.Tasks.Patient.Mappers;

namespace Vsb.UrgentApp.Tasks.TagEventType
{
    public class TagEventTypeTasks : ITagEventTypeTasks
    {
        private readonly ITagEventTypeDtoMapper _tagEventTypeDtoMapper;
        private readonly ITagEventTypeRepository _tagEventTypeRepository;


        public TagEventTypeTasks(
			ITagEventTypeDtoMapper tagEventTypeDtoMapper,
            ITagEventTypeRepository tagEventTypeRepository
        )
		{
		    this._tagEventTypeDtoMapper = Requires.IsNotNull(tagEventTypeDtoMapper, nameof(tagEventTypeDtoMapper));
		    this._tagEventTypeRepository = Requires.IsNotNull(tagEventTypeRepository, nameof(tagEventTypeRepository));
        }


		public List<TagEventTypeDto> GetAll()
		{
		    var foundTagEventTypes = _tagEventTypeRepository.GetAll();
		    List<TagEventTypeDto> result = foundTagEventTypes.MapAllUsing<Domain.DomainObjects.Entities.TagEventType, TagEventTypeDto>(_tagEventTypeDtoMapper).ToList();
			
			return result;
		}

        public TagEventTypeDto GetById(int id)
        {
            TagEventTypeDto result = _tagEventTypeDtoMapper.MapFrom(_tagEventTypeRepository.Get(id));

            return result;
        }
    }
}
