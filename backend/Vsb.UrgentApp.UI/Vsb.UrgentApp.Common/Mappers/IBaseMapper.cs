using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Common.Mappers
{
	public interface IBaseMapper
	{
		T BindData<T>(DataTable dt);

		List<T> BindDataList<T>(DataTable dt);
	}
}
