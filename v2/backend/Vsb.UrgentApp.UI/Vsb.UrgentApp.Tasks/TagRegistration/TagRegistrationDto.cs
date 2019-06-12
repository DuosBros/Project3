using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Tag;

namespace Vsb.UrgentApp.Tasks.TagRegistration
{
    public class TagRegistrationDto
    {
        public int Id { get; set; }

		public TagDto Tag { get; set; }

		public PatientDto Patient { get; set; }

		public DateTime Created { get; set; }
    }
}
