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
	public class TagOverride : IAutoMappingOverride<Tag>
	{
		public void Override(AutoMapping<Tag> mapping)
		{
			mapping.Cache.ReadOnly().Region("LongTerm");
		    mapping.HasOne(tag => tag.TagRegistration).PropertyRef(x => x.Tag).Not.LazyLoad().Cascade.All();

		    mapping.HasMany(x => x.TagEvents)
		        .Cascade.Delete()
		        .KeyColumn("ID");
            //mapping.HasOne(tag => tag.).PropertyRef(x => x.Tag).Not.LazyLoad();
        }
	}
}
