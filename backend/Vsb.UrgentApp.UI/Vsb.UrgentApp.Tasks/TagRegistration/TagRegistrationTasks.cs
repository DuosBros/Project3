using System;
using System.Collections.Generic;
using System.Linq;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Infrastructure.Db;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Tag;

namespace Vsb.UrgentApp.Tasks.TagRegistration
{
	public class TagRegistrationTasks : ITagRegistrationTasks
    {
		private readonly IBaseMapper baseMapper;
		private readonly ITagRepository tagRepository;
		private readonly IPatientRepository patientRepository;

		public TagRegistrationTasks(
			ITagTasks tagTasks,
			IBaseMapper baseMapper,
			ITagRepository tagRepository,
			IPatientRepository patientRepository
		)
        {
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
			this.tagRepository = Requires.IsNotNull(tagRepository, nameof(tagRepository));
			this.patientRepository = Requires.IsNotNull(patientRepository, nameof(patientRepository));
		}

        public List<TagRegistrationDto> GetAll()
        {
			List<TagRegistrationDto> tagRegistrations = baseMapper.BindDataList<TagRegistrationDto>(
				tagRepository.GetTagRegistrationAll().TagRegistration
			);

			List<PatientDto> patients = baseMapper.BindDataList<PatientDto>(
				patientRepository.GetPatients().Patient
			);

			List<TagDto> tags = baseMapper.BindDataList<TagDto>(
				tagRepository.GetTagAll().Tag
			);

			for (int i = 0; i < tagRegistrations.Count; i++)
			{
				tagRegistrations[i].Patient = patients.FirstOrDefault(x => x.Id == tagRegistrations[i].Patient_Id);
				tagRegistrations[i].Tag = tags.FirstOrDefault(x => x.Id == tagRegistrations[i].Tag_Id);
			}

			return tagRegistrations;
		}

		/// <summary>
		/// Creates the specified tag registration.
		/// </summary>
		/// <param name="tagRegistration">The tag registration.</param>
		/// <returns></returns>
		public TagRegistrationDto Create(TagRegistrationDto tagRegistration)
		{
			CheckForPKViolations(tagRegistration);

			CheckForDuplication(tagRegistration);

			tagRepository.CreateTagRegistration(tagRegistration.Tag_Id, tagRegistration.Patient_Id);

			var result = GetTagRegistrationByTagId(tagRegistration.Tag_Id);

			return result;
		}

		/// <summary>
		/// Deletes the specified identifier.
		/// </summary>
		/// <param name="patientId">The identifier.</param>
		/// <exception cref="System.ApplicationException"></exception>
		public void Delete(int patientId)
        {
            var check = GetByPatientId(patientId);

            if (check == null)
            {
                throw new ApplicationException();
            }

			tagRepository.DeleteTagRegistration(patientId);
		}
        
        private TagRegistrationDto GetTagRegistrationByTagId(int tagId)
        {
			TagRegistrationDto result = new TagRegistrationDto();

			result = baseMapper.BindData<TagRegistrationDto>(
				tagRepository.GetTagRegistrationByTagId(tagId).TagRegistration
			);

            if (result == null)
            {
                return result;
            }

			result.Tag = baseMapper.BindData<TagDto>(
				tagRepository.GetTagById(result.Tag_Id).Tag
			);

			result.Patient = baseMapper.BindData<PatientDto>(
				patientRepository.GetPatientById(result.Patient_Id).Patient
			);

			return result;
		}

        public TagRegistrationDto GetByPatientId(int patientId)
        {
            TagRegistrationDto result = new TagRegistrationDto();

            result = baseMapper.BindData<TagRegistrationDto>(
                tagRepository.GetTagRegistrationByPatientId(patientId).TagRegistration
            );

            if (result == null)
            {
                return result;
            }

            result.Tag = baseMapper.BindData<TagDto>(
                tagRepository.GetTagById(result.Tag_Id).Tag
            );

            result.Patient = baseMapper.BindData<PatientDto>(
                patientRepository.GetPatientById(result.Patient_Id).Patient
            );

            return result;
        }

        #region PRIVATE METHODS

        private void CheckForDuplication(TagRegistrationDto tagRegistrationDto)
		{
			var patientCheck = GetByPatientId(tagRegistrationDto.Patient_Id);

			if (patientCheck != null)
			{
				throw new ApplicationException(
					$"The record with patient_Id: {tagRegistrationDto.Patient_Id} already existing.");
			}

			var tagCheck = GetTagRegistrationByTagId(tagRegistrationDto.Tag_Id);

			if (tagCheck != null)
			{
				throw new ApplicationException(
					$"The record with tag_Id: {tagRegistrationDto.Tag_Id} already existing.");
			}

			var tagRegistration = GetTagRegistrationByTagId(tagRegistrationDto.Tag_Id);
			if (tagRegistration?.Patient_Id == tagRegistrationDto.Patient_Id)
			{
				throw new ApplicationException(
					$"The record with patient_Id: {tagRegistrationDto.Patient_Id} and tag_Id {tagRegistrationDto.Tag_Id} is already existing.");
			}
		}


        private void CheckForPKViolations(TagRegistrationDto tagRegistration)
        {
			var tag = baseMapper.BindData<TagDto>(
				tagRepository.GetTagById(tagRegistration.Tag_Id).Tag
			);

			var patient = baseMapper.BindData<TagDto>(
				patientRepository.GetPatientById(tagRegistration.Patient_Id).Patient
			);

			if (tag == null || patient == null)
			{
				throw new ApplicationException();
			}
        }

        #endregion // PRIVATE METHODS
    }
}
