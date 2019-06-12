
using System.Collections.Generic;
using System.Linq;
using NLog;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Infrastructure.Db;
using Vsb.UrgentApp.Tasks.Tag.Mappers;

namespace Vsb.UrgentApp.Tasks.Tag
{
	public class TagTasks : ITagTasks
    {
	    private static Logger Log = LogManager.GetCurrentClassLogger();
        private readonly ITagRepository _tagRepository;
        private readonly ITagDtoMapper _tagDtoMapper;

		public TagTasks(
		    ITagRepository tagRepository,
		    ITagDtoMapper tagDtoMapper)
        {		
            this._tagRepository = Requires.IsNotNull(tagRepository, nameof(tagRepository));
            this._tagDtoMapper = Requires.IsNotNull(tagDtoMapper, nameof(tagDtoMapper));
        }

        public List<TagDto> GetAll()
        {
            var result = _tagRepository.GetAll();

            return result.MapAllUsing<Domain.DomainObjects.Entities.Tag, TagDto>(this._tagDtoMapper).ToList();
        }

		public TagDto Get(int id)
        {
            
			TagDto result = new TagDto();

            var foundTag = _tagRepository.Get(id);

            if (foundTag != null)
            {
                result = _tagDtoMapper.MapFrom(foundTag);
            }

			return result;
        }
	}
}
