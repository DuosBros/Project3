using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.DomainModel;

namespace Vsb.UrgentApp.Domain.DomainObjects.Entities
{
	public class TagEventType : Entity
	{
		public virtual int HW_Key { get; set; }

		public virtual string Name { get; set; }

		public virtual string Note { get; set; }
	}
}
