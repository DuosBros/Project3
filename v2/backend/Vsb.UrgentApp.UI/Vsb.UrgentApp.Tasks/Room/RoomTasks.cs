
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Infrastructure.Db;

namespace Vsb.UrgentApp.Tasks.Room
{
	public class RoomTasks : IRoomTasks
	{
		private readonly IRoomRepository roomRepository;

		public RoomTasks(
			IRoomRepository roomRepository)
		{
		    this.roomRepository = Requires.IsNotNull(roomRepository, nameof(roomRepository));
		}

		
	}
}
