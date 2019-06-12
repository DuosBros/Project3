using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.Patient
{
	public interface IPatientTasks
	{
		List<PatientDto> GetAll(bool? showDeleted, int? maxPatients);

	    PatientDto Get(int id);

        PatientDto Create(PatientDto patient);

		void Update(PatientDto patient);

		void Delete(int id);

	    PatientDto GetByCardId(int cardId);
	}
}
