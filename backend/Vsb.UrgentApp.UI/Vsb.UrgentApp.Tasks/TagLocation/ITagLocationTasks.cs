﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.TagLocation
{
	public interface ITagLocationTasks
	{
		List<TagLocationDto> GetAll();
	}
}