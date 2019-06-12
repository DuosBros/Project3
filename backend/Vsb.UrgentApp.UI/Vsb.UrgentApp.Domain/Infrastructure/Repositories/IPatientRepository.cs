using RtlsEngine.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.PersistenceSupport;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Domain.Infrastructure.Repositories
{
	public interface IPatientRepository : ILinqRepository<Patient>, IRepository<Patient>
	{
	    MyDataSet GetPatientsWithFilter(bool showDeleted, int? maxPatients);

        MyDataSet GetPatientById(int id);

		MyDataSet GetPatients();

		MyDataSet GetPatientByCardId(long cardId);

		void UpdateDeletedTimestamp(int patientId);
	}
}
