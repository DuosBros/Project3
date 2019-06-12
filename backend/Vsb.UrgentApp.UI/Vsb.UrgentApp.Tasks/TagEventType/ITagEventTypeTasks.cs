using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.TagEventType
{
    public interface ITagEventTypeTasks
    {
        List<TagEventTypeDto> GetAll();

        TagEventTypeDto GetById(int Id);
    }
}
