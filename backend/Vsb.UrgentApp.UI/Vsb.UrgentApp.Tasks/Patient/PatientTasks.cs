using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using NHibernate;
using NLog;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Domain.Specifications;
using Vsb.UrgentApp.Infrastructure.Db;
using Vsb.UrgentApp.Tasks.Patient.Mappers;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.TagRegistration;
using Vsb.UrgentApp.Tasks.TagRegistration.Mappers;

namespace Vsb.UrgentApp.Tasks.Patient
{
	public class PatientTasks : IPatientTasks
	{
		private readonly IPatientRepository patientRepository;
        private readonly ITagRepository tagRepository;
		private readonly ITagRegistrationRepository tagRegistrationRepository;
		private readonly IBaseMapper baseMapper;
		private readonly IPatientDtoMapper patientDtoMapper;
		private readonly ITagRegistrationDtoMapper tagRegistrationDtoMapper;
		private static Logger Log = LogManager.GetCurrentClassLogger();

		public PatientTasks(
			IBaseMapper baseMapper,
			IPatientRepository patientRepository,
			ITagRepository tagRepository,
			IPatientDtoMapper patientDtoMapper,
			ITagRegistrationRepository tagRegistrationRepository,
			ITagRegistrationDtoMapper tagRegistrationDtoMapper
		)
		{
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
			this.patientRepository = Requires.IsNotNull(patientRepository, nameof(patientRepository));
			this.tagRepository = Requires.IsNotNull(tagRepository, nameof(tagRepository));
			this.patientDtoMapper = Requires.IsNotNull(patientDtoMapper, nameof(patientDtoMapper));
			this.tagRegistrationRepository = Requires.IsNotNull(tagRegistrationRepository, nameof(tagRegistrationRepository));
			this.tagRegistrationDtoMapper = Requires.IsNotNull(tagRegistrationDtoMapper, nameof(tagRegistrationDtoMapper));
		}

		public PatientDto AssignTagToPatient(int tagId, int patientId)
		{
			tagRepository.CreateTagRegistration(tagId, patientId);

			return GetById(patientId);
		}

	    public List<PatientDto> GetFilteredPatients(bool showDeleted, int? maxPatients)
	    {
	        try
	        {
	            List<PatientDto> patients = new List<PatientDto>();

	            List<TagDto> tags = baseMapper.BindDataList<TagDto>(
	                tagRepository.GetTagAll().Tag
	            );

	            List<TagRegistrationDto> tagRegistrations = baseMapper.BindDataList<TagRegistrationDto>(
	                tagRepository.GetTagRegistrationAll().TagRegistration
	            );

	            patients = baseMapper.BindDataList<PatientDto>(
	                patientRepository.GetPatientsWithFilter(showDeleted, maxPatients).Patient
	            );

	            foreach (PatientDto patient in patients)
	            {
		            var found = tagRegistrations.FirstOrDefault(x => x.Patient_Id == patient.Id);

		            var foundTag = found != null ?
			            tags.FirstOrDefault(x => x.Id == found.Tag_Id) : null;

		            if (foundTag != null)
		            {
			            patient.Tag = foundTag;
		            }
		            else
		            {
			            patient.Tag = null;
		            }
	            }

	            return patients;
	        }
	        catch (Exception ex)
	        {
	            Log.Error(ex);
	            throw;
	        }
        }

	    public PatientDto GetById(int patientId)
	    {
			var patient = patientRepository.FindOne(patientId);

			PatientDto result = patientDtoMapper.MapFrom(patient);

			//PatientDto result = baseMapper.BindData<PatientDto>(
			//	patientRepository.GetPatientById(patientId).Patient
			//);

			//var tagRegistration = baseMapper.BindData<TagRegistrationDto>(
			//	tagRepository.GetTagRegistrationByPatientId(result.Id).TagRegistration
			//);

			//if (tagRegistration == null)
			//{
			//	return result;
			//}

			//result.Tag = baseMapper.BindData<TagDto>(
			//	tagRepository.GetTagById(tagRegistration.Tag_Id).Tag
			//);

			return result;
		}

        //TODO to same jak u update
		public PatientDto Create(PatientDto patientDto, bool createTagRegistration)
		{
            PatientDto result = new PatientDto();

			//NHibernate
			var patient = patientDtoMapper.MapFrom(patientDto);

			using (ITransaction t = NHibernateSession.Current.BeginTransaction())
			{
				patientRepository.Save(patient);

				t.Commit();
			}

			var createdPatient = patientRepository.FindAll(new PatientByCardIdSpecification(patient.Card_Id)).ToList().First();
			var tag = tagRepository.Get(patientDto.Tag.Id);

			if (tag == null)
			{
				throw new ApplicationException(string.Format("Tag with ID: {0} is not existing.", patientDto.Tag.Id));
			}

			createdPatient.Tag = tag;

			if (patientDto.Tag != null)
			{
				if (createdPatient != null)
				{
					TagRegistrationDto tagRegistrationDto = new TagRegistrationDto()
					{
						Tag_Id = tag.Id,
						Patient_Id = createdPatient.Id,
						Created = DateTime.UtcNow
					};

					var tagRegistration = tagRegistrationDtoMapper.MapFrom(tagRegistrationDto);

					using (ITransaction t = NHibernateSession.Current.BeginTransaction())
					{
						tagRegistrationRepository.Save(tagRegistration);

						t.Commit();
					}
				}
			}

			result = patientDtoMapper.MapFrom(createdPatient);

			//if (patientDto.Tag != null)
			//{
			//	var tagCheck = baseMapper.BindData<TagDto>(
			//		tagRepository.GetTagById(patientDto.Tag.Id).Tag
			//	);

			//	if (tagCheck == null)
			//	{
			//		throw new ApplicationException();
			//	}

			//	string query = string.Format(
			//		UrgentAppQueries.PATIENT_INSERT,
			//		patientDto.Card_Id,
			//		patientDto.SocialSecurityNumber,
			//		patientDto.FirstName,
			//		patientDto.MiddleName,
			//		patientDto.LastName,
			//		string.IsNullOrEmpty(patientDto.BirthDate) ? "NULL" : ('\'' + patientDto.BirthDate + '\'')
			//	);

			//	FireBirdConnection.ExecuteQuery(
			//		FireBirdConnection.Connection, query);

			//	result = GetByCardId(patientDto.Card_Id);

			//	if (result != null)
			//	{
			//		if (createTagRegistration)
			//		{
			//			tagRepository.CreateTagRegistration(patientDto.Tag.Id, result.Id);
			//			result.Tag = tagCheck;
			//		}
			//	}
			//}
			//else
			//{
			//	throw new ApplicationException("Missing tag");
			//	//string query = string.Format(
			//	//	UrgentAppQueries.PATIENT_INSERT_WITHOUTTAG,
			//	//	patient.Card_Id,
			//	//	patient.SocialSecurityNumber,
			//	//	patient.FirstName,
			//	//	patient.MiddleName,
			//	//	patient.LastName,
			//	//	patient.BirthDate.HasValue ? patient.BirthDate.Value.ToShortDateString() : "NULL"
			//	//);

			//	//FireBirdConnection.ExecuteQuery(
			//	//	FireBirdConnection.Connection, query);

			//	//   result = GetByCardId(patient.Card_Id);
			//}

			return result;
		}

		public List<PatientDto> GetAll()
		{
			List<PatientDto> result = new List<PatientDto>();

			var patients = patientRepository.GetAll();

			result = patients.MapAllUsing<Domain.DomainObjects.Entities.Patient, PatientDto>(patientDtoMapper).ToList();

			return result;  
		}

		public List<PatientDto> GetAllWithoutNHibernate()
		{
			try
			{
				List<PatientDto> patients = new List<PatientDto>();

				List<TagDto> tags = baseMapper.BindDataList<TagDto>(
					tagRepository.GetTagAll().Tag
				);

				List<TagRegistrationDto> tagRegistrations = baseMapper.BindDataList<TagRegistrationDto>(
					tagRepository.GetTagRegistrationAll().TagRegistration
				);

				patients = baseMapper.BindDataList<PatientDto>(
					patientRepository.GetPatients().Patient
				);

				for (int i = 0; i < patients.Count; i++)
				{
					var found = tagRegistrations.FirstOrDefault(x => x.Patient_Id == patients[i].Id);

					var foundTag = found != null ?
						tags.FirstOrDefault(x => x.Id == found.Tag_Id) : null;

					if (foundTag != null)
					{
						patients[i].Tag = foundTag;
					}
					else
					{
						patients[i].Tag = null;
					}
				}

				return patients;
			}
			catch (Exception ex)
			{
				Log.Error(ex);
				throw;
			}
		}

		public void Update(PatientDto patient)
        {
			
            //if (patient.Tag != null)
            //{
            //    TagRegistrationDto tagRegistration = baseMapper.BindData<TagRegistrationDto>(
            //        tagRepository.GetTagRegistrationByPatientId(patient.Id).TagRegistration
            //    );

            //    if (tagRegistration == null)
            //    { 
            //        tagRepository.CreateTagRegistration(patient.Tag.Id, patient.Id);
            //    }
            //}
            //else
            //{
            //    TagRegistrationDto tagRegistration = baseMapper.BindData<TagRegistrationDto>(
            //        tagRepository.GetTagRegistrationByPatientId(patient.Id).TagRegistration
            //    );

            //    if (tagRegistration != null)
            //    {
            //        tagRepository.DeleteTagRegistration(patient.Id);//(patient.Tag.Id, patient.Id);
            //    }
            //}

            List<ClassHelper> filteredPropertiesAndValues = FilterNullOrEmptyPatientProperties(patient);

            string query = BuildUpdatePatientQuery(filteredPropertiesAndValues);

            FireBirdConnection.ExecuteQuery(
                FireBirdConnection.Connection, query);
        }


        public void Delete(int patientId)
		{
			SetDeletedTimeStamp(patientId);

			RemoveTagReference(patientId);

		}

		private void RemoveTagReference(int patientId)
		{

			tagRepository.DeleteTagRegistration(patientId);
		}


        #region PRIVATE METHODS

        private static List<ClassHelper> FilterNullOrEmptyPatientProperties(PatientDto patient)
        {
            List<ClassHelper> propertiesAndValuesList = new List<ClassHelper>();
            List<ClassHelper> filteredPropertiesAndValuesList = new List<ClassHelper>();

            var properties = typeof(PatientDto).GetProperties();

            foreach (var property in properties)
            {
                string propertyName = property.Name;
                var value = property.GetValue(patient, null);

                ClassHelper temp = new ClassHelper
                {
                    PropertyName = propertyName,
                    Value = value
                };

                propertiesAndValuesList.Add(temp);
            }

            foreach (var item in propertiesAndValuesList)
            {
                if (item.PropertyName.ToLower() == "deleted")
                {
                    filteredPropertiesAndValuesList.Add(item);
                    continue;
                }

                if (item.PropertyName.ToLower() == "tag")
                {
                    continue;
                }

				if (item.Value != null)
                {
                    if (item.Value.ToString().Length > 0)
                    {
                        filteredPropertiesAndValuesList.Add(item);
                    }
                }
            }
            //var filteredPropertiesAndValues = propertiesAndValuesList.Where(val => val.Value != null)
            //    .Where(str => str.Value.ToString().Length > 0)
            //    .ToList();

            return filteredPropertiesAndValuesList;
        }

        private static string BuildUpdatePatientQuery(List<ClassHelper> filteredPropertiesAndValues)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("UPDATE PATIENT SET");

            for (int i = filteredPropertiesAndValues.Count - 1; i >= 0; i--)
            {
                if (filteredPropertiesAndValues[i].PropertyName.ToLower() == "id")
                {
                    sb.Append(string.Format(" WHERE {0} = '{1}'", filteredPropertiesAndValues[i].PropertyName, filteredPropertiesAndValues[i].Value));
                }
                else if(filteredPropertiesAndValues[i].PropertyName.ToLower() == "deleted" &&
                    i == filteredPropertiesAndValues.Count - 1)
                {
                    sb.Append(string.Format(" {0} = NULL", filteredPropertiesAndValues[i].PropertyName));
                }
                else if (filteredPropertiesAndValues[i].PropertyName.ToLower() == "deleted" &&
                    i != filteredPropertiesAndValues.Count - 1)
                {
                    sb.Append(string.Format(", {0} = NULL", filteredPropertiesAndValues[i].PropertyName));
                }
                else if (i == filteredPropertiesAndValues.Count - 1)
                {
                    sb.Append(string.Format(" {0} = '{1}'", filteredPropertiesAndValues[i].PropertyName, filteredPropertiesAndValues[i].Value));
                }
                else if (filteredPropertiesAndValues[i].PropertyName == "tag")
                {
                    continue;
                }
                else
                {
                    sb.Append(string.Format(", {0} = '{1}'", filteredPropertiesAndValues[i].PropertyName, filteredPropertiesAndValues[i].Value));
                }
            }
            sb.Append(";");

            return sb.ToString();
        }

        private void SetDeletedTimeStamp(int id)
		{
			patientRepository.UpdateDeletedTimestamp(id);
		}

		private PatientDto GetByCardId(long cardId)
		{
			PatientDto result = baseMapper.BindData<PatientDto>(
				patientRepository.GetPatientByCardId(cardId).Patient
			);

			if (result.Tag != null)
				result.Tag = baseMapper.BindData<TagDto>(
					tagRepository.GetTagById(result.Tag.Id).Tag
				);

			return result;
		}

		#endregion // PRIVATE METHODS
	}
}
        
