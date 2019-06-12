using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.TagEvent
{
    public interface ITagEventTask
    {
        List<TagEventDto> GetByTagId(int tagId);

        List<TagEventDto> GetByPatientId(int patientId);

        List<TagEventDto> GetAll();

		TagEventDto Create(TagEventDto tagEvent);

        TagEventDto Update(TagEventDto tagEvent);
    }
}
