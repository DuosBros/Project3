using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Room;
using Vsb.UrgentApp.Tasks.Tag;

namespace Vsb.UrgentApp.Tasks.TagLocation
{
	public class TagLocationDto
	{
		public int Id { get; set; }

		public int Tag_Id { get; set; }

		public int Room_Id { get; set; }

		public DateTime Created { get; set; }

		public int Patient_Id { get; set; }

		public TagDto Tag { get; set; }

		public PatientDto Patient { get; set; }

		public RoomDto Room { get; set; }
	}
}
