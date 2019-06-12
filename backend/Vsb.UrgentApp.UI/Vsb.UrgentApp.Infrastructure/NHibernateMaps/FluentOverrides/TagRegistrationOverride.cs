using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentNHibernate.Automapping;
using FluentNHibernate.Automapping.Alterations;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.FluentOverrides
{
	public class TagRegistrationOverride : IAutoMappingOverride<TagRegistration>
	{
		public void Override(AutoMapping<TagRegistration> mapping)
		{
			mapping.Cache.ReadOnly().Region("LongTerm");
			mapping.Id(x => x.Id).GeneratedBy.Sequence("GEN_TAGREGISTRATION_ID");
		}
	}
}
