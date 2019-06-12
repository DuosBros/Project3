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
	public class TagLocationByTagId : QuerySpecification<TagLocation>
	{
		private readonly long _tagId;

		public TagLocationByTagId(long tagId)
		{
			this._tagId = tagId;
		}

		public override Expression<Func<TagLocation, bool>> MatchingCriteria
		{
			get
			{
				return tagLocation => tagLocation.Tag.Id == _tagId;
			}
		}
	}
}
