using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using SharpArch.Domain.DomainModel;

namespace Vsb.UrgentApp.Domain.DomainObjects.Entities
{
	public class Patient : Entity
	{
		//public virtual int Id { get; set; }

		public virtual long Card_Id { get; set; }

		public virtual string SocialSecurityNumber { get; set; }

		public virtual string FirstName { get; set; }

		public virtual string MiddleName { get; set; }
		public virtual string LastName { get; set; }

		public virtual string BirthDate { get; set; }

		public virtual DateTime? Deleted { get; set; }

		public virtual Tag Tag { get; set; }

	}
}
