﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Tasks.User
{
    public class UserDto
    {
        public string Name { get; set; }

        public string Password { get; set; }

		public DateTime LastAccess { get; set; }
    }
}
