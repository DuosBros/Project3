using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Infrastructure.Configuration
{
    public interface IWebApiConfiguration
    {
        string User { get; set; }

        string Password { get; set; }

        string Database { get; set; }

        string DataSource { get; set; }

        int Port { get; set; }

        int Dialect { get; set; }

        string Charset { get; set; }

        int ConnectionLifetime { get; set; }

        bool Pooling { get; set; }

        int MinPoolSize { get; set; }

        int MaxPoolSize { get; set; }

        int PacketSize { get; set; }

        int ServerType { get; set; }
    }
}
