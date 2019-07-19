using NHibernate;
using NLog;
using SharpArch.NHibernate;
using System;
using System.Collections.Generic;
using System.Linq;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Domain.Specifications;
using Vsb.UrgentApp.Tasks.Patient.Mappers;

namespace Vsb.UrgentApp.Tasks.Patient
{
    public class PatientTasks : IPatientTasks
    {
        private readonly IPatientRepository _patientRepository;

        private readonly ITagRegistrationRepository _tagRegistrationRepository;
        private readonly IPatientDtoMapper _patientDtoMapper;

        private static Logger _log = LogManager.GetCurrentClassLogger();

        public PatientTasks(
            IPatientRepository patientRepository,
            IPatientDtoMapper patientDtoMapper,
            ITagRegistrationRepository tagRegistrationRepository
        )
        {
            this._patientRepository = Requires.IsNotNull(patientRepository, nameof(patientRepository));
            this._patientDtoMapper = Requires.IsNotNull(patientDtoMapper, nameof(patientDtoMapper));
            this._tagRegistrationRepository = Requires.IsNotNull(tagRegistrationRepository, nameof(tagRegistrationRepository));
        }

        /// <summary>
        /// Creates the specified patient dto.
        /// </summary>
        /// <param name="patientDto">The patient dto.</param>
        /// <returns></returns>
        /// <exception cref="System.ApplicationException"></exception>
        public PatientDto Create(PatientDto patientDto)
        {
            PatientDto result = new PatientDto();

            var patient = _patientDtoMapper.MapFrom(patientDto);

            if (patient.TagRegistration != null)
            {
                patient.TagRegistration.Patient = patient;
            }
            patient.Created = DateTime.UtcNow;
            using (ITransaction t = NHibernateSession.Current.BeginTransaction())
            {
                var temp = _patientRepository.SaveOrUpdate(patient);
                result = _patientDtoMapper.MapFrom(temp);
                t.Commit();
            }

            return result;
        }

        /// <summary>
        /// Gets patients.
        /// </summary>
        /// <param name="showDeleted">The show deleted.</param>
        /// <param name="maxPatients">The maximum patients.</param>
        /// <returns></returns>
        public List<PatientDto> GetAll(bool? showDeleted, int? maxPatients)
        {
            List<PatientDto> result = new List<PatientDto>();

            if (showDeleted.HasValue)
            {
                result = showDeleted == true ? _patientRepository.GetDeletedPatients().MapAllUsing<Domain.DomainObjects.Entities.Patient, PatientDto>(_patientDtoMapper).ToList()
                    : _patientRepository.GetActivePatients().MapAllUsing<Domain.DomainObjects.Entities.Patient, PatientDto>(_patientDtoMapper).ToList();
            }
            else
            {
                result = _patientRepository.GetAll().MapAllUsing<Domain.DomainObjects.Entities.Patient, PatientDto>(_patientDtoMapper).ToList();
            }

            if (maxPatients.HasValue)
            {
                result = result.Take(maxPatients.Value).ToList();
            }

            return result;
        }

        public PatientDto GetByCardId(string cardId)
        {
            PatientDto result = new PatientDto();

            var check = _patientRepository
                .FindAll(new PatientByCardIdSpecification(cardId)).FirstOrDefault();

            if (check == null)
            {
                throw new ApplicationException($"Patient with cardId: {cardId} not found");
            }

            result = _patientDtoMapper.MapFrom(check);

            return result;
        }
        public PatientDto Get(int id)
        {
            PatientDto result = _patientDtoMapper.MapFrom(_patientRepository.Get(id));

            return result;
        }

        public void Update(PatientDto patient)
        {

            var foundPatient = _patientRepository.Get(patient.Id);

            if (foundPatient == null)
            {
                throw new ObjectNotFoundException(patient.Id, typeof(Domain.DomainObjects.Entities.Patient));
            }

            Domain.DomainObjects.Entities.Patient mappedPatient = _patientDtoMapper.MapFrom(patient);

            // I give up. The object has to be get in NHibernate session, modified and then save will work
            foundPatient.BirthDate = mappedPatient.BirthDate;
            foundPatient.Card_Id = mappedPatient.Card_Id;
            foundPatient.FirstName = mappedPatient.FirstName;
            foundPatient.MiddleName = mappedPatient.MiddleName;
            foundPatient.LastName = mappedPatient.LastName;
            foundPatient.SocialSecurityNumber = mappedPatient.SocialSecurityNumber;



            var check = _tagRegistrationRepository
                .FindAll(new TagRegistrationByTagIdAndPatientIdSpecification(patient.Id, patient.Tag.Id)).ToList();

            if (check.Count == 0)
            {
                foundPatient.TagRegistration = mappedPatient.TagRegistration;
                foundPatient.TagRegistration.Patient = foundPatient;
            }
            else
            {
                foundPatient.TagRegistration = check.First();
            }

            using (ITransaction t = NHibernateSession.Current.BeginTransaction())
            {
                this._patientRepository.SaveOrUpdate(foundPatient);
                t.Commit();
            }
        }


        public void Delete(int patientId)
        {
            SetDeletedTimeStamp(patientId);

            RemoveTagReference(patientId);

        }


        #region PRIVATE METHODS


        private void SetDeletedTimeStamp(int id)
        {
            var patient = _patientRepository.Get(id);
            patient.Deleted = DateTime.UtcNow;

            _patientRepository.SaveAndEvict(patient);
        }

        private void RemoveTagReference(int patientId)
        {
            var tagRegistration = _tagRegistrationRepository
                .FindAll(new TagRegistrationByTagIdAndPatientIdSpecification(patientId, null)).ToList().FirstOrDefault();

            if (tagRegistration != null)
            {
                _tagRegistrationRepository.DeleteTagRegistration(tagRegistration.Id);
            }

        }

        #endregion // PRIVATE METHODS
    }
}

