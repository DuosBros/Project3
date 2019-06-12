using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static RtlsEngine.DB.MyDataSet;

namespace Vsb.UrgentApp.Tasks.Tag
{
    public interface ITagTasks
    {
        List<TagDto> GetAll();

        TagDto GetById(int Id);
    }
}
