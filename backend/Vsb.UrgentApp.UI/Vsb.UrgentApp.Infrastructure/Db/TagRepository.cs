using RtlsEngine.DB;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;

namespace Vsb.UrgentApp.Infrastructure.Db
{
	public class TagRepository : LinqRepository<Tag>, ITagRepository
	{
		public MyDataSet GetTagById(int id)
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.Tag, string.Format(UrgentAppQueries.TAG_SELECT_BYID, id));

			return ds;
		}

		public MyDataSet GetTagAll()
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.Tag, string.Format(Queries.TAG_SELECT));

			return ds;
		}

		public MyDataSet GetTagRegistrationAll()
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.TagRegistration, UrgentAppQueries.TAGREGISTRATION_SELECT);

			return ds;
		}

		public void CreateTagRegistration(int tagId, int patientId)
		{
			string query = string.Format(
				UrgentAppQueries.TAGREGISTRATION_INSERT,
				tagId,
				patientId
			);

			FireBirdConnection.ExecuteQuery(
				FireBirdConnection.Connection, query);
		}

		public void DeleteTagRegistration(int patientId)
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.ExecuteQuery(
				FireBirdConnection.Connection,
				string.Format(UrgentAppQueries.TAGREGISTRATION_DELETE_BYPATIENTID, patientId));
		}

		public MyDataSet GetTagRegistrationByTagId(int tagId)
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.TagRegistration, string.Format(UrgentAppQueries.TAGREGISTRATION_SELECT_BYTAGID, tagId));

			return ds;
		}

		public MyDataSet GetTagRegistrationByPatientId(int patientId)
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
			   FireBirdConnection.Connection,
			   ds.TagRegistration, string.Format(UrgentAppQueries.TAGREGISTRATION_SELECT_BYPATIENTID, patientId));

			return ds;
		}

		public MyDataSet GetAllLocations()
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.TagLocation, UrgentAppQueries.TAGLOCATION_SELECT);

			return ds;
		}

		public MyDataSet GetAllTagEventTypes()
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.TagEventType, Queries.TAGEVENTTYPE_SELECT);

			return ds;
		}

		public MyDataSet GetTagEventTypeById(int tagEventTypeId)
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.TagEventType, string.Format(UrgentAppQueries.TAGEVENTTYPE_SELECT_BYID, tagEventTypeId));

			return ds;
		}

        public MyDataSet GetTagEventsByPatientId(int patientId)
        {
            MyDataSet ds = new MyDataSet();
            ds.EnforceConstraints = false;

            FireBirdConnection.SelectQuery(
                FireBirdConnection.Connection,
                ds.TagEvent, string.Format(UrgentAppQueries.TAGEVENT_SELECT_BYPATIENTID, patientId));

            return ds;
        }

	    public MyDataSet GetTagEventByIds(int tagId, int tagEventTypeId, int patientId)
	    {
	        MyDataSet ds = new MyDataSet();
	        ds.EnforceConstraints = false;

	        FireBirdConnection.SelectQuery(
	            FireBirdConnection.Connection,
	            ds.TagEvent, string.Format(UrgentAppQueries.TAGEVENT_SELECT_BYTAGID_PATIENTID_TAGEVENTTYPEID, tagId, patientId, tagEventTypeId));

	        return ds;
        }

	    public MyDataSet GetTagEventsByTagId(int tagId)
        {
            MyDataSet ds = new MyDataSet();
            ds.EnforceConstraints = false;

            FireBirdConnection.SelectQuery(
                FireBirdConnection.Connection,
                ds.TagEvent, string.Format(UrgentAppQueries.TAGEVENT_SELECT_BYTAGID, tagId));

            return ds;
        }

        public MyDataSet GetAllTagEvents()
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.TagEvent, Queries.TAGEVENT_SELECT);

			return ds;
		}

		public MyDataSet GetTagEventById(int tagEventId)
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.TagEvent, string.Format(UrgentAppQueries.TAGEVENT_SELECT_BYID, tagEventId));

			return ds;
		}


	}
}
