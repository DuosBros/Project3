﻿using RtlsEngine.DB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Domain.Infrastructure.Repositories
{
	public interface IRoomRepository
	{
		MyDataSet GetRoomsAll();

		MyDataSet GetRoomById(int roomId);
	}
}