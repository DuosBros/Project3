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
    public class TagEventOverride : IAutoMappingOverride<TagEvent>
    {
        public void Override(AutoMapping<TagEvent> mapping)
        {
            mapping.Id(x => x.Id).GeneratedBy.Sequence("GEN_TAGEVENT_ID");
            mapping.Map(x => x.Modified).Column("CREATED_MODIFIED");
            //mapping.Map(x => x.Tag.Id).Column("TAG_ID");
            //mapping.Map(x => x.Patient.Id).Column("PATIENT_ID");
            //mapping.Map(x => x.TagEventType.Id).Column("TAGEVENTTYPE_ID");
            //mapping.HasOne(tagEvent => tagEvent.Tag).Not.LazyLoad();
            //mapping.HasOne(tagEvent => tagEvent.Patient).Not.LazyLoad();
            //mapping.HasOne(tagEvent => tagEvent.TagEventType).Not.LazyLoad();
        }
    }
}
