using FluentNHibernate.Automapping;
using FluentNHibernate.Automapping.Alterations;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.FluentOverrides
{
    public class TagEventTypeOverride : IAutoMappingOverride<TagEventType>
    {
        public void Override(AutoMapping<TagEventType> mapping)
        {
            mapping.Cache.ReadOnly().Region("LongTerm");
            
            mapping.HasMany(x => x.TagEvents)
                .Cascade.Delete()
                .KeyColumn("ID");
        }
    }
}
