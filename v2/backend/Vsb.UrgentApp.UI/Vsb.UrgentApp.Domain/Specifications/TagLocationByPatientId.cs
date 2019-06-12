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
	public class TagLocationByPatientId : QuerySpecification<TagLocation>
	{
		private readonly long _patientId;

		public TagLocationByPatientId(long patientId)
		{
			this._patientId = patientId;
		}

		public override Expression<Func<TagLocation, bool>> MatchingCriteria
		{
			get
			{
				return tagLocation => tagLocation.Patient.Id == _patientId;
			}
		}
	}
}
