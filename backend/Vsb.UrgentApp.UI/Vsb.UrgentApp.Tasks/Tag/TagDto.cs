using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static RtlsEngine.DB.MyDataSet;

namespace Vsb.UrgentApp.Tasks.Tag
{
    public class TagDto
    {
        public int Id { get; set; }

        public int HW_Key { get; set; }

        public string Name { get; set; }

        public string Note { get; set; }

		public int Battery { get; set; }

		public DateTime Last_Seen { get; set; }
    }
}
