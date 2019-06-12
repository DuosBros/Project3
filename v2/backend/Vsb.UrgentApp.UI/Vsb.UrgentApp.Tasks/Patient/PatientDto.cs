using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.TagRegistration;

namespace Vsb.UrgentApp.Tasks.Patient
{
    public class PatientDto
    {
        public int Id { get; set; }

        public long CardId { get; set; }

        public string SocialSecurityNumber { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string BirthDate { get; set; }

        public DateTime Created { get; set; }

        public DateTime? Deleted { get; set; }

        public TagDto Tag { get; set; }
        
    }
}
