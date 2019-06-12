using System;
using System.Collections.Generic;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Infrastructure.Db;
using Vsb.UrgentApp.Tasks.TagEventType;
using System.Linq;
using NHibernate;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Domain.Specifications;
using Vsb.UrgentApp.Tasks.TagEvent.Mappers;

namespace Vsb.UrgentApp.Tasks.TagEvent
{
	public class TagEventTasks : ITagEventTask
    {
        private readonly ITagEventRepository _tagEventRepository;
        private readonly ITagEventDtoMapper _tagEventDtoMapper;

        public TagEventTasks(
			ITagEventRepository tagEventTypeRepository,
			ITagEventDtoMapper tagEventTypeDtoMapper
        )
		{
		    this._tagEventRepository = Requires.IsNotNull(tagEventTypeRepository, nameof(tagEventTypeRepository));
		    this._tagEventDtoMapper = Requires.IsNotNull(tagEventTypeDtoMapper, nameof(tagEventTypeDtoMapper));
        }
        
        public TagEventDto Create(TagEventDto tagEvent)
        {
            TagEventDto result = new TagEventDto();
            
            var tagEventEntity = _tagEventDtoMapper.MapFrom(tagEvent);
            var now = DateTime.UtcNow;
            tagEventEntity.Created = now;
            tagEventEntity.Modified = now;

            using (ITransaction t = NHibernateSession.Current.BeginTransaction())
            {
                var temp = _tagEventRepository.SaveOrUpdate(tagEventEntity);
                result = _tagEventDtoMapper.MapFrom(temp);
                t.Commit();
            }

            return result;
        }

        public TagEventDto Update(TagEventDto tagEvent)
        {
            TagEventDto result = new TagEventDto();
            
            //var entity = _tagEventRepository.Get(tagEvent.Id);

            //if (entity != null)
            //{
            //    _tagEventRepository.DeleteTagEvent(entity.Id);
            //}

            //var duplicatedEventType = _tagEventRepository
            //    .FindAll(new TagEventByTagIdAndPatientIdSpecification(tagEvent.Patient.Id, tagEvent.Tag.Id))
            //    .FirstOrDefault(x => x.TagEventType.Id == tagEvent.TagEventType.Id);

            //if (duplicatedEventType != null)
            //{
            //    _tagEventRepository.DeleteTagEvent(duplicatedEventType.Id);
            //}

            var entityToSave = _tagEventDtoMapper.MapFrom(tagEvent);
            entityToSave.Modified = DateTime.UtcNow;

            using (ITransaction t = NHibernateSession.Current.BeginTransaction())
            {
                var temp = _tagEventRepository.SaveOrUpdate(entityToSave);
                result = _tagEventDtoMapper.MapFrom(temp);
                t.Commit();
            }

            return result;
        }

        public List<TagEventDto> GetByTagId(int tagId)
        {
            List<TagEventDto> result = new List<TagEventDto>();

            var check = _tagEventRepository
                .FindAll(new TagEventByTagIdAndPatientIdSpecification(null, tagId)).ToList();
            
            result = check.MapAllUsing<Domain.DomainObjects.Entities.TagEvent, TagEventDto>(_tagEventDtoMapper).ToList();

            return result;
        }

        public List<TagEventDto> GetByPatientId(int patientId)
        {
            List<TagEventDto> result = new List<TagEventDto>();

            var check = _tagEventRepository
                .FindAll(new TagEventByTagIdAndPatientIdSpecification(patientId, null)).ToList();

            result = check.MapAllUsing<Domain.DomainObjects.Entities.TagEvent, TagEventDto>(_tagEventDtoMapper).ToList();

            return result;
        }

        public List<TagEventDto> GetAll()
        {
            var tagEventsList = _tagEventRepository.GetAll();

            List<TagEventDto> tagEvents = tagEventsList.MapAllUsing<Domain.DomainObjects.Entities.TagEvent,TagEventDto>(_tagEventDtoMapper).ToList();

            return tagEvents;
        }        
    }
}
