using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.Patient
{
	public interface IPatientTasks
	{
		List<PatientDto> GetAllWithoutNHibernate();

		List<PatientDto> GetAll();

		PatientDto GetById(int id);

		PatientDto Create(PatientDto patient, bool createTagRegistration);

		void Update(PatientDto patient);

		void Delete(int id);

		PatientDto AssignTagToPatient(int tagId, int patientId);
        
        List<PatientDto> GetFilteredPatients(bool showDeleted, int? maxPatients);
    }
}
