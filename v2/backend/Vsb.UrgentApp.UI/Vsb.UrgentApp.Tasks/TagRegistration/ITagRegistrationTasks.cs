using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.TagRegistration
{
    public interface ITagRegistrationTasks
    {
        List<TagRegistrationDto> GetAll();

		TagRegistrationDto Create(TagRegistrationDto tagRegistration);

        void Delete(int patientId);

        TagRegistrationDto GetByPatientId(int patientId);
    }
}
