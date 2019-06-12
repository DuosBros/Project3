using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RtlsEngine.DB;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Common.Helpers;

namespace Vsb.UrgentApp.Infrastructure.Db
{
    public class UserRepository : IUserRepository
    {

        public MyDataSet AuthenticateUser(string name, string password)
        {
            MyDataSet ds = new MyDataSet { EnforceConstraints = false };

            FireBirdConnection.SelectQuery(
                FireBirdConnection.Connection,
                ds.User, string.Format(UrgentAppQueries.USER_SELECT, name, password));

            return ds;
        }
    }
}
