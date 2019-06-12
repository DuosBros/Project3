using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.DomainModel;

namespace Vsb.UrgentApp.Domain.DomainObjects.Entities
{
	public class TagRegistration : Entity
	{
		public virtual Tag Tag { get; set; }
        
        public virtual Patient Patient { get; set; }

        public virtual DateTime Created { get; set; }
	}
}
