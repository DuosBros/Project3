using System;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Room;
using Vsb.UrgentApp.Tasks.Tag;

namespace Vsb.UrgentApp.Tasks.TagLocation
{
    public class TagLocationDto
    {
        public int Id { get; set; }

        public DateTime Created { get; set; }

        public DateTime Modified { get; set; }

        public TagDto Tag { get; set; }

        public PatientDto Patient { get; set; }

        public RoomDto Room { get; set; }
    }
}
