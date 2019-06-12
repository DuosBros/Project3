using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.Tag
{
    public interface ITagTasks
    {
        List<TagDto> GetAll();

        TagDto Get(int id);
    }
}
