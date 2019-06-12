using RtlsEngine.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Infrastructure.Db;

namespace Vsb.UrgentApp.Tasks.TagEventType
{
    public class TagEventTypeTasks : ITagEventTypeTasks
    {
		private readonly IBaseMapper baseMapper;
		private readonly ITagRepository tagRepository;

		public TagEventTypeTasks(
			IBaseMapper baseMapper,
			ITagRepository tagRepository
		)
		{
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
			this.tagRepository = Requires.IsNotNull(tagRepository, nameof(tagRepository));
		}


		public List<TagEventTypeDto> GetAll()
        {
			List<TagEventTypeDto> lst = baseMapper.BindDataList<TagEventTypeDto>(tagRepository.GetAllTagEventTypes().TagEventType);

			return lst;
		}

        public TagEventTypeDto GetById(int tagEventTypeId)
        {
			TagEventTypeDto result = baseMapper.BindData<TagEventTypeDto>(tagRepository.GetTagEventTypeById(tagEventTypeId).TagEventType);

			return result;
		}
    }
}
