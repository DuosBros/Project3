using System;
using System.Collections.Generic;
using System.Linq;
using NHibernate;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Domain.Specifications;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.TagRegistration.Mappers;

namespace Vsb.UrgentApp.Tasks.TagRegistration
{
	public class TagRegistrationTasks : ITagRegistrationTasks
    {
		private readonly ITagRegistrationRepository _tagRegistrationRepository;
		private readonly ITagRegistrationDtoMapper _tagRegistrationDtoMapper;
        private readonly ITagTasks _tagTasks;
        private readonly IPatientTasks _patientTasks;

        public TagRegistrationTasks(
			ITagTasks tagTasks,
			IPatientTasks patientTasks,
			ITagRegistrationRepository tagRegistrationRepository,
			ITagRegistrationDtoMapper tagRegistrationDtoMapper
		)
        {
            this._tagTasks = Requires.IsNotNull(tagTasks, nameof(tagTasks));
            this._tagRegistrationRepository = Requires.IsNotNull(tagRegistrationRepository, nameof(tagRegistrationRepository));
			this._tagRegistrationDtoMapper = Requires.IsNotNull(tagRegistrationDtoMapper, nameof(tagRegistrationDtoMapper));
            this._patientTasks = Requires.IsNotNull(patientTasks, nameof(patientTasks));
        }

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <returns></returns>
        public List<TagRegistrationDto> GetAll()
        {
            var tempTagRegistrations = _tagRegistrationRepository.GetAll();

            var result = tempTagRegistrations.MapAllUsing<Domain.DomainObjects.Entities.TagRegistration, TagRegistrationDto>(_tagRegistrationDtoMapper).ToList();

            return result;
        }

		/// <summary>
		/// Creates the specified tag registration.
		/// </summary>
		/// <param name="tagRegistration">The tag registration.</param>
		/// <returns></returns>
		public TagRegistrationDto Create(TagRegistrationDto tagRegistration)
        {
            CheckIfReferencesAreExisting(tagRegistration);
            
            var check = _tagRegistrationRepository
                .FindAll(new TagRegistrationByTagIdAndPatientIdSpecification(tagRegistration.Patient.Id, tagRegistration.Tag.Id)).FirstOrDefault();

            if (check != null)
            {
                _tagRegistrationRepository.DeleteTagRegistration(tagRegistration.Id);
            }

            var tagRegistrationEntity = _tagRegistrationDtoMapper.MapFrom(tagRegistration);

            tagRegistrationEntity.Created = DateTime.UtcNow;

            Domain.DomainObjects.Entities.TagRegistration resultFromSaveOrUpdate;

            using (ITransaction t = NHibernateSession.Current.BeginTransaction())
            {
                resultFromSaveOrUpdate = _tagRegistrationRepository.SaveOrUpdate(tagRegistrationEntity);
                t.Commit();
            }
            
            var result = _tagRegistrationDtoMapper.MapFrom(resultFromSaveOrUpdate);

            return result;
        }

        /// <summary>
        /// Deletes the specified tag registration identifier.
        /// </summary>
        /// <param name="tagRegistrationId">The tag registration identifier.</param>
        public void Delete(int tagRegistrationId)
        {
            var check = _tagRegistrationRepository.Get(tagRegistrationId);
                
            if (check != null)
            {
                _tagRegistrationRepository.DeleteTagRegistration(tagRegistrationId);
            }
        }


        public TagRegistrationDto GetByPatientId(int patientId)
        {
            TagRegistrationDto result = new TagRegistrationDto();

            var check = _tagRegistrationRepository
                .FindAll(new TagRegistrationByTagIdAndPatientIdSpecification(patientId, null)).FirstOrDefault();

            if (check != null)
            {
                result = _tagRegistrationDtoMapper.MapFrom(check);
            }
            else
            {
                return null;
            }
            
            return result;
        }

        #region PRIVATE METHODS
        private void CheckIfReferencesAreExisting(TagRegistrationDto tagRegistration)
        {
            var tagCheck = _tagTasks.Get(tagRegistration.Tag.Id);
            var patientCheck = _patientTasks.Get(tagRegistration.Patient.Id);

            if (tagCheck == null || patientCheck == null)
            {
                throw new ApplicationException("TagId or PatientId already existing!");
            }
        }

        #endregion // PRIVATE METHODS
    }
}
