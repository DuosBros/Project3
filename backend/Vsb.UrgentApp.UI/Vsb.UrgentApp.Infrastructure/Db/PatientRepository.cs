using RtlsEngine.DB;
using System;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;

namespace Vsb.UrgentApp.Infrastructure.Db
{
	public class PatientRepository : LinqRepository<Patient>, IPatientRepository
	{
		public MyDataSet GetPatientById(int id)
		{
			MyDataSet ds = new MyDataSet {EnforceConstraints = false};

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.Patient, string.Format(UrgentAppQueries.PATIENT_SELECT_BYID, id));

			return ds;
		}

	    public MyDataSet GetPatientsWithFilter(bool showDeleted, int? maxPatients)
	    {
	        MyDataSet ds = new MyDataSet { EnforceConstraints = false };

            if (maxPatients.HasValue)
	        {
	            if (showDeleted)
	            {
	                FireBirdConnection.SelectQuery(
	                    FireBirdConnection.Connection,
	                    ds.Patient, string.Format(UrgentAppQueries.PATIENT_SELECT_DELETED, maxPatients.Value));
                }
	            else
	            {
	                FireBirdConnection.SelectQuery(
	                    FireBirdConnection.Connection,
	                    ds.Patient, UrgentAppQueries.PATIENT_SELECT_EXCLUDEDELETED);
                }
            }

	        return ds;
	    }

		public MyDataSet GetPatients()
		{
			MyDataSet ds = new MyDataSet {EnforceConstraints = false};

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.Patient, UrgentAppQueries.PATIENT_SELECT);

			return ds;
		}

		public MyDataSet GetPatientByCardId(long cardId)
		{
			MyDataSet ds = new MyDataSet {EnforceConstraints = false};

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.Patient, string.Format(UrgentAppQueries.PATIENT_SELECT_BYCARDID, cardId));

			return ds;
		}

		public void UpdateDeletedTimestamp(int patientId)
		{
			string query = string.Format(
							UrgentAppQueries.PATIENT_DELETE,
							DateTime.UtcNow,
							patientId
						);

			FireBirdConnection.ExecuteQuery(
				FireBirdConnection.Connection, query);
		}
	}
}
