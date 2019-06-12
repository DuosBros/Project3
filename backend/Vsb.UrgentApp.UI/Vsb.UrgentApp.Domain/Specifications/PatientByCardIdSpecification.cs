using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.Specifications;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Domain.Specifications
{
	public class PatientByCardIdSpecification : QuerySpecification<Patient>
	{
		private readonly long cardID;

		public PatientByCardIdSpecification(long cardID)
		{
			this.cardID = cardID;
		}

		public override Expression<Func<Patient, bool>> MatchingCriteria
		{
			get
			{
				return patient => patient.Card_Id == cardID;
			}
		}
	}
}
