using Microsoft.Practices.ServiceLocation;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tests.Common;

namespace Vsb.UrgentApp.UnitTests
{
	public class PatientTests : IntegrationTestsBase
	{
		private IPatientTasks _patientTasks;
		private ITagTasks _tagTasks;

		[SetUp]		
		public void Init()
		{
			_patientTasks = ServiceLocator.Current.GetInstance<IPatientTasks>();
			_tagTasks = ServiceLocator.Current.GetInstance<ITagTasks>();
		}

        [Test]
        public void GetAllPatients_void_success()
        {
            var patients = _patientTasks.GetAll(showDeleted: null, maxPatients: null);

            Assert.IsNotNull(patients);
            Assert.IsTrue(patients.Count > 0);
        }

        //[Test]
        //public void GetPatientById_PatientId_success()
        //{
        //	var patients = _patientTasks.GetAll();

        //	Assert.IsNotNull(patients);
        //	Assert.IsTrue(patients.Count > 0);

        //	Random rnd = new Random();
        //	var index = rnd.Next(0, patients.Count - 1);

        //	var result = _patientTasks.GetById(patients[index].Id);

        //	Assert.IsNotNull(result);
        //}

        //[Test]
        //public void DeletePatient_PatientId_success()
        //{
        //	DateTime start = DateTime.UtcNow;

        //	var patients = _patientTasks.GetAll();

        //	Assert.IsNotNull(patients);
        //	Assert.IsTrue(patients.Count > 0);

        //	patients = patients.Where(x => x.Tag != null).ToList();

        //	Random rnd = new Random();
        //	var index = rnd.Next(0, patients.Count - 1);

        //	var patient = _patientTasks.GetById(patients[index].Id);

        //	Assert.IsNotNull(patient);


        //	_patientTasks.Delete(patient.Id);

        //	var result = _patientTasks.GetById(patient.Id);

        //	Assert.IsTrue(result.Deleted.HasValue);
        //	Assert.IsTrue(result.Deleted.Value.Hour ==  start.Hour);
        //}

        //[Test]
        //public void CreatePatientWithoutTag_PatientDto_success()
        //{
        //	PatientDto patient = new PatientDto
        //	{
        //		Card_Id = 135464,
        //		SocialSecurityNumber = "13556/0018",
        //		FirstName = "Olafson",
        //		MiddleName = "Lameson",
        //		LastName = "Zjebson",
        //		BirthDate = new DateTime(1950, 05, 05).ToString(),
        //		Tag = null,
        //		Deleted = null
        //	};

        //	var result = _patientTasks.Create(patient, false);

        //	Assert.IsNotNull(result);
        //}

        //[Test]
        //public void AssignTagToPatient_PatientDto_success()
        //{
        //	var patients = _patientTasks.GetAll();
        //	var tags = _tagTasks.GetAll();
        //	var allTags = tags;

        //	Assert.IsNotNull(patients);
        //	Assert.IsTrue(patients.Count > 0);

        //	Assert.IsNotNull(tags);
        //	Assert.IsTrue(tags.Count > 0);

        //	var patientsWithTags = patients.Where(x => x.Tag != null).ToList();
        //	var patientsWithoutTags = patients.Except(patientsWithTags).ToList();

        //	Assert.AreEqual(patients.Count, patientsWithTags.Count + patientsWithoutTags.Count);

        //          var patientTagIds = patientsWithTags.Select(patient => patient.Tag.Id);

        //          var unassignedTags = tags.Where(tag => !patientTagIds.Contains(tag.Id)).ToList();

        //	Assert.AreEqual(unassignedTags.Count, allTags.Count - patientsWithTags.Count);

        //	Random rnd = new Random();
        //	var tagIndex = rnd.Next(0, unassignedTags.Count - 1);
        //	var patientIndex = rnd.Next(0, patientsWithoutTags.Count - 1);

        //	var result = _patientTasks.AssignTagToPatient(unassignedTags[tagIndex].Id, patientsWithoutTags[patientIndex].Id);

        //	Assert.IsNotNull(result);
        //	Assert.IsNotNull(result.Tag);
        //	Assert.AreEqual(result.Tag.Id, unassignedTags[tagIndex].Id);
        //}

        //[Test]
        //public void UpdatePatient()
        //{
        //	var patients = _patientTasks.GetAll();

        //	Random rnd = new Random();
        //	var patientIndex = rnd.Next(0, patients.Count - 1);

        //	var patientToUpdate = patients[patientIndex];

        //	patientToUpdate.FirstName = "TestUpdatePatientFirstName";
        //	patientToUpdate.LastName = "TestUpdatePatientLastName";

        //	_patientTasks.Update(patientToUpdate);

        //	var fetchedpatient = _patientTasks.GetById(patientToUpdate.Id);

        //	Assert.AreEqual(fetchedpatient.FirstName, patientToUpdate.FirstName);
        //	Assert.AreEqual(fetchedpatient.LastName, patientToUpdate.LastName);

        //}
    }
}
