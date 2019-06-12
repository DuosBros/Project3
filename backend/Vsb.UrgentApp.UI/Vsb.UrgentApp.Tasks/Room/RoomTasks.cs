using RtlsEngine.DB;
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
		private readonly IBaseMapper baseMapper;
		private readonly IRoomRepository roomRepository;

		public RoomTasks(
			IBaseMapper baseMapper,
			IRoomRepository roomRepository)
		{
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
			this.roomRepository = Requires.IsNotNull(roomRepository, nameof(roomRepository));
		}

		public List<RoomDto> GetAll()
		{
			List<RoomDto> rooms = baseMapper.BindDataList<RoomDto>(roomRepository.GetRoomsAll().Room);

			return rooms;
		}

		public RoomDto GetById(int id)
		{
			RoomDto result = new RoomDto();

			result = baseMapper.BindData<RoomDto>(roomRepository.GetRoomById(id).Room);

			return result;
		}
	}
}
