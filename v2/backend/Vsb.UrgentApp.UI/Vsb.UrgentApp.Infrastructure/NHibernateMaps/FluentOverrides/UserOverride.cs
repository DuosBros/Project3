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
    public class UserOverride : IAutoMappingOverride<User>
    {
        public void Override(AutoMapping<User> mapping)
        {
            //mapping.Cache.ReadWrite().Region("LongTermReadWrite");
            mapping.Id(x => x.Id).GeneratedBy.Sequence("GEN_USER_ID");
            mapping.Map(x => x.LastAccess).Column("LAST_ACCESS");
        }
    }
}
