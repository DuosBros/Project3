using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;

namespace Vsb.UrgentApp.Infrastructure.Db
{
    public class TagEventRepository : LinqRepository<TagEvent>, ITagEventRepository
    {
        public void DeleteTagEvent(int id)
        {

            string sql1 = "delete from TagEvent TE" +
                          " where TE.Id = :TagEventId";

            this.Session.CreateQuery(sql1).SetParameter("TagEventId", id)
                .ExecuteUpdate();

        }
    }
}
