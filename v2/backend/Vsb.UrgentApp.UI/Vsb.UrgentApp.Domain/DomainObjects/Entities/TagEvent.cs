using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.DomainModel;

namespace Vsb.UrgentApp.Domain.DomainObjects.Entities
{
	public class TagEvent : Entity
	{
		public virtual DateTime Created { get; set; }

		public virtual DateTime Modified { get; set; }

		public virtual Tag Tag { get; set; }

		public virtual Patient Patient { get; set; }

		public virtual TagEventType TagEventType { get; set; }
	}
}
