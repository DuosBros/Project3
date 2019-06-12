using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.DomainModel;

namespace Vsb.UrgentApp.Domain.DomainObjects.Entities
{
	public class User : Entity
	{
		public virtual string Name { get; set; }

		public virtual string Password { get; set; }

		public virtual DateTime LastAccess { get; set; }
	}
}
