using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using SharpArch.NHibernate;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Common.Helpers;

namespace Vsb.UrgentApp.Infrastructure.Db
{
    public class UserRepository : LinqRepository<Domain.DomainObjects.Entities.User>, IUserRepository
    {
    }
}
