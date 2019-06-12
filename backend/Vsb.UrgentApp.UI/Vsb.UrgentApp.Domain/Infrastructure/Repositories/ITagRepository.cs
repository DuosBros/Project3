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
	public interface ITagRepository : ILinqRepository<Tag>, IRepository<Tag>
	{

		MyDataSet GetTagById(int id);

		MyDataSet GetTagAll();

		void CreateTagRegistration(int tagId, int patientId);

		MyDataSet GetTagRegistrationAll();

		void DeleteTagRegistration(int patientId);

		MyDataSet GetTagRegistrationByTagId(int tagId);

		MyDataSet GetTagRegistrationByPatientId(int patientId);

		MyDataSet GetAllLocations();

		MyDataSet GetAllTagEventTypes();

		MyDataSet GetTagEventTypeById(int tagEventTypeId);

        MyDataSet GetTagEventsByPatientId(int patientId);

        MyDataSet GetAllTagEvents();

		MyDataSet GetTagEventByIds(int tagId, int tagEventTypeId, int patientId);

        MyDataSet GetTagEventsByTagId(int tagId);

	    MyDataSet GetTagEventById(int tagEventId);
	}
}
