using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RtlsEngine.DB;

namespace Vsb.UrgentApp.Domain.Infrastructure.Repositories
{
    public interface IUserRepository
    {
        MyDataSet AuthenticateUser(string name, string password);

    }
}
