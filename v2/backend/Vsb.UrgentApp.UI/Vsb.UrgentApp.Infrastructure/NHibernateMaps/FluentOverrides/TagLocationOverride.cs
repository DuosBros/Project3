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
    public class TagLocationOverride : IAutoMappingOverride<TagLocation>
    {
        public void Override(AutoMapping<TagLocation> mapping)
        {
            mapping.Id(x => x.Id).GeneratedBy.Sequence("GEN_TAGLOCATION_ID");
            mapping.Map(x => x.CreatedModified).Column("CREATED_MODIFIED");
            //mapping.HasManyToMany<Tag>(x => x.Tag); ;// HasOne(tagLocation => tagLocation.Tag).Not.LazyLoad();
            //mapping.HasManyToMany<Room>(x => x.Room);
            //mapping.HasManyToMany<Patient>(x => x.Patient);

            //mapping.HasOne(tagLocation => tagLocation.Patient).Not.LazyLoad();
            //mapping.HasOne(tagLocation => tagLocation.Room).Not.LazyLoad();
        }
    }
}
