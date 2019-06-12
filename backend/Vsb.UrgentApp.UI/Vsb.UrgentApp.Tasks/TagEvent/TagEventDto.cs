using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.TagEventType;
using static RtlsEngine.DB.MyDataSet;

namespace Vsb.UrgentApp.Tasks.TagEvent
{
    public class TagEventDto
    {
        public int Id { get; set; }

        public int Tag_Id { get; set; }

        public int TagEventType_Id { get; set; }

        public DateTime Created { get; set; }

	    public DateTime Created_Modified { get; set; }

		public int? Patient_Id { get; set; }

		public TagDto Tag { get; set; }

		public PatientDto Patient { get; set; }

		public TagEventTypeDto TagEventType { get; set; }
    }
}
