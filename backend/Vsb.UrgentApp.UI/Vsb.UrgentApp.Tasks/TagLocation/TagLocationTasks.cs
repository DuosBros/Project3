using System.Collections.Generic;
using System.Linq;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Room;
using Vsb.UrgentApp.Tasks.Tag;

namespace Vsb.UrgentApp.Tasks.TagLocation
{
	public class TagLocationTasks : ITagLocationTasks
	{
		private readonly IBaseMapper baseMapper;
		private readonly ITagRepository tagRepository;
		private readonly IPatientRepository patientRepository;
		private readonly IRoomRepository roomRepository;


		public TagLocationTasks(
			IBaseMapper baseMapper,
			ITagRepository tagRepository,
			IPatientRepository patientRepository,
			IRoomRepository roomRepository)
		{
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
			this.tagRepository = Requires.IsNotNull(tagRepository, nameof(tagRepository));
			this.patientRepository = Requires.IsNotNull(patientRepository, nameof(patientRepository));
			this.roomRepository = Requires.IsNotNull(roomRepository, nameof(roomRepository));
		}

		public List<TagLocationDto> GetAll()
		{
			List<TagLocationDto> tagLocations = baseMapper.BindDataList<TagLocationDto>(
				tagRepository.GetAllLocations().TagLocation);

			List<RoomDto> rooms = baseMapper.BindDataList<RoomDto>(
				roomRepository.GetRoomsAll().Room
			);

			List<PatientDto> patients = baseMapper.BindDataList<PatientDto>(
				patientRepository.GetPatients().Patient
			);

			List<TagDto> tags = baseMapper.BindDataList<TagDto>(
				tagRepository.GetTagAll().Tag
			);


			for (int i = 0; i < tagLocations.Count; i++)
			{
				tagLocations[i].Patient = patients.Where(x => x.Id == tagLocations[i].Patient_Id).FirstOrDefault();
				tagLocations[i].Room = rooms.Where(x => x.Id == tagLocations[i].Room_Id).FirstOrDefault();
				tagLocations[i].Tag = tags.Where(x => x.Id == tagLocations[i].Tag_Id).FirstOrDefault();
			}

			return tagLocations;
		}
	}
}
