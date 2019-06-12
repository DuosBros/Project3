using RtlsEngine.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;

namespace Vsb.UrgentApp.Infrastructure.Db
{
	public class RoomRepository : IRoomRepository
	{
		public MyDataSet GetRoomById(int roomId)
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.Room, string.Format(UrgentAppQueries.ROOM_SELECT_BYID, roomId));

			return ds;
		}

		public MyDataSet GetRoomsAll()
		{
			MyDataSet ds = new MyDataSet();
			ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
				FireBirdConnection.Connection,
				ds.Room, Queries.ROOM_SELECT);

			return ds;
		}
	}
}
