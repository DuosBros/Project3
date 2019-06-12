using RtlsEngine.DB;
using System;
using System.Collections.Generic;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Infrastructure.Db;
using Vsb.UrgentApp.Tasks.TagEventType;
using System.Linq;
using System.Text;
using FluentNHibernate.Utils;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;

namespace Vsb.UrgentApp.Tasks.TagEvent
{
	public class TagEventTasks : ITagEventTask
    {
		private readonly IBaseMapper baseMapper;
		private readonly ITagRepository tagRepository;
		private readonly IPatientRepository patientRepository;

		public TagEventTasks(
			IBaseMapper baseMapper,
			ITagRepository tagRepository,
			IPatientRepository patientRepository
		)
		{
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
			this.tagRepository = Requires.IsNotNull(tagRepository, nameof(tagRepository));
			this.patientRepository = Requires.IsNotNull(patientRepository, nameof(patientRepository));
		}

        public List<TagEventDto> GetByPatientId(int patientId)
        {
            List<TagEventDto> tagEvents = baseMapper.BindDataList<TagEventDto>(
                tagRepository.GetTagEventsByPatientId(patientId).TagEvent);

            foreach (var item in tagEvents)
            {
                item.Patient = baseMapper.BindData<PatientDto>(
                    patientRepository.GetPatientById(item.Patient_Id.Value).Patient);

                item.Tag = baseMapper.BindData<TagDto>(
                    tagRepository.GetTagById(item.Tag_Id).Tag);

                item.TagEventType = baseMapper.BindData<TagEventTypeDto>(
                    tagRepository.GetTagEventTypeById(item.TagEventType_Id).TagEventType);
            }

            return tagEvents;
        }

        public List<TagEventDto> GetByTagId(int tagId)
        {
            List<TagEventDto> tagEvents = baseMapper.BindDataList<TagEventDto>(
                tagRepository.GetTagEventsByTagId(tagId).TagEvent);

            foreach (var item in tagEvents)
            {
                if (item.Patient_Id != null)
                    item.Patient = baseMapper.BindData<PatientDto>(
                        patientRepository.GetPatientById(item.Patient_Id.Value).Patient);

                item.Tag = baseMapper.BindData<TagDto>(
                    tagRepository.GetTagById(item.Tag_Id).Tag);

                item.TagEventType = baseMapper.BindData<TagEventTypeDto>(
                    tagRepository.GetTagEventTypeById(item.TagEventType_Id).TagEventType);
            }
            
            return tagEvents.OrderByDescending(x => x.Created).ToList();
        }

        public TagEventDto Create(TagEventDto tagEvent)
        {    
			TagEventTypeDto type = baseMapper.BindData<TagEventTypeDto>(
			tagRepository.GetTagEventTypeById(tagEvent.TagEventType_Id).TagEventType);

			if (type == null)
            {
                throw new ApplicationException();
            }

			tagEvent.Created = DateTime.UtcNow;

			string query = string.Format(
                UrgentAppQueries.TAGEVENT_INSERT,
                tagEvent.Tag_Id,
                tagEvent.TagEventType_Id,
                tagEvent.Created,
                tagEvent.Patient_Id);

	        FireBirdConnection.ExecuteQuery(
                FireBirdConnection.Connection, query);

			return GetByIds(tagEvent);
		}

        public TagEventDto Update(TagEventDto tagEvent)
        {
            List<ClassHelper> filteredPropertiesAndValues = FilterNullOrEmptyPatientProperties(tagEvent);

            string query = BuildUpdateTagEventQuery(filteredPropertiesAndValues);

            FireBirdConnection.ExecuteQuery(
                FireBirdConnection.Connection, query);

            return GetByIds(tagEvent);
        }

        private string BuildUpdateTagEventQuery(List<ClassHelper> filteredPropertiesAndValues)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("UPDATE TAGEVENT SET");

            for (int i = filteredPropertiesAndValues.Count - 1; i >= 0; i--)
            {
                if (filteredPropertiesAndValues[i].PropertyName.ToLower() == "tag")
                {
                    continue;
                }
                else if (filteredPropertiesAndValues[i].PropertyName.ToLower() == "patient")
                {
                    continue;
                }
                else if (filteredPropertiesAndValues[i].PropertyName.ToLower() == "tageventtype")
                {
                    continue;
                }
                else if (filteredPropertiesAndValues[i].PropertyName.ToLower() == "id")
                {
                    sb.Append(string.Format(" WHERE {0} = '{1}'", filteredPropertiesAndValues[i].PropertyName, filteredPropertiesAndValues[i].Value));
                }
                else if (filteredPropertiesAndValues[i].PropertyName.ToLower() == "patient_id" &&
                         filteredPropertiesAndValues[i].Value == null)
                {
                    sb.Append(string.Format(" {0} = NULL", filteredPropertiesAndValues[i].PropertyName));
                }
                else if (sb.Length == 19)
                {
                    sb.Append(string.Format(" {0} = '{1}'", filteredPropertiesAndValues[i].PropertyName,
                        filteredPropertiesAndValues[i].Value));
                }

                else
                {
                    sb.Append(string.Format(", {0} = '{1}'", filteredPropertiesAndValues[i].PropertyName,
                        filteredPropertiesAndValues[i].Value));
                }
            }
            sb.Append(";");

            return sb.ToString();
        }

        public List<TagEventDto> GetAll()
        {     
           
			List<TagEventDto> tagEvents = baseMapper.BindDataList<TagEventDto>(
				tagRepository.GetAllTagEvents().TagEvent);

			List<PatientDto> patients = baseMapper.BindDataList<PatientDto>(
				patientRepository.GetPatients().Patient
			);

			List<TagDto> tags = baseMapper.BindDataList<TagDto>(
				tagRepository.GetTagAll().Tag
			);

			List<TagEventTypeDto> tagEventTypes = baseMapper.BindDataList<TagEventTypeDto>(
				tagRepository.GetAllTagEventTypes().TagEventType
			);

			for (int i = 0; i < tagEvents.Count; i++)
			{
			    tagEvents[i].Patient = patients.FirstOrDefault(x => x.Id == tagEvents[i].Patient_Id);
			    tagEvents[i].TagEventType = tagEventTypes.FirstOrDefault(x => x.Id == tagEvents[i].TagEventType_Id);
			    tagEvents[i].Tag = tags.FirstOrDefault(x => x.Id == tagEvents[i].Tag_Id);
			}

			return tagEvents;
        }

		private TagEventDto GetByIds(TagEventDto tagEvent)
		{
		    TagEventDto result = new TagEventDto();

            if (tagEvent.Patient_Id.HasValue)
		    {
		        result = baseMapper.BindData<TagEventDto>(
		            tagRepository.GetTagEventByIds(tagEvent.Tag_Id, tagEvent.TagEventType_Id, tagEvent.Patient_Id.Value).TagEvent);
            }
            else
            {
                result = baseMapper.BindData<TagEventDto>(
                    tagRepository.GetTagEventById(tagEvent.Id).TagEvent);
            }

            if (result.Patient_Id != null)
		    {
		        result.Patient = baseMapper.BindData<PatientDto>(
		            patientRepository.GetPatientById(result.Patient_Id.Value).Patient
		        );

		    }
           
			result.Tag = baseMapper.BindData<TagDto>(
				tagRepository.GetTagById(result.Tag_Id).Tag
			);

			result.TagEventType = baseMapper.BindData<TagEventTypeDto>(
				tagRepository.GetTagEventTypeById(result.TagEventType_Id).TagEventType
			);

			return result;
		}

        private static List<ClassHelper> FilterNullOrEmptyPatientProperties(TagEventDto tagEvent)
        {
            List<ClassHelper> propertiesAndValuesList = new List<ClassHelper>();

            var properties = typeof(TagEventDto).GetProperties();

            foreach (var property in properties)
            {
                string propertyName = property.Name;
                var value = property.GetValue(tagEvent, null);

                ClassHelper temp = new ClassHelper
                {
                    PropertyName = propertyName,
                    Value = value
                };

                propertiesAndValuesList.Add(temp);
            }

            //foreach (var item in propertiesAndValuesList)
            //{
            //    if (item.PropertyName.ToLower() == "deleted") 
            //    {
            //        filteredPropertiesAndValuesList.Add(item);
            //        continue;
            //    }

            //    if (item.PropertyName.ToLower() == "tag")
            //    {
            //        continue;
            //    }
            //    if (item.Value != null)
            //    {
            //        if (item.Value.ToString().Length > 0)
            //        {
            //            filteredPropertiesAndValuesList.Add(item);
            //        }
            //    }
            //}
            //var filteredPropertiesAndValues = propertiesAndValuesList.Where(val => val.Value != null)
            //    .Where(str => str.Value.ToString().Length > 0)
            //    .ToList();

            return propertiesAndValuesList;
        }
    }
}
