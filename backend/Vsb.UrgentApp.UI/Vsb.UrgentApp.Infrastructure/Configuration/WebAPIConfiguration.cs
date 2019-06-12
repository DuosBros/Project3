using System;
using System.Configuration;
using System.Diagnostics;

namespace Vsb.UrgentApp.Infrastructure.Configuration
{
    public class WebApiConfiguration : IWebApiConfiguration
    {

        public string User { get; set; }

        public string Password { get; set; }

        public string Database { get; set; }

        public string DataSource { get; set; }

        public int Port { get; set; }

        public int Dialect { get; set; }

        public string Charset { get; set; }

        public int ConnectionLifetime { get; set; }

        public bool Pooling { get; set; }

        public int MinPoolSize { get; set; }

        public int MaxPoolSize { get; set; }

        public int PacketSize { get; set; }

        public int ServerType { get; set; }

     
        public static WebApiConfiguration CreateFrom(
            string user,
            string password,
            string database,
            string datasource,
            int port,
            int dialect,
            string charset,
            int connectionLifetime,
            bool pooling,
            int minPoolSize,
            int maxPoolSize,
            int packetSize,
            int serverType)
        {
            Debug.Assert(user != null, "user may not be null");
            Debug.Assert(password != null, "password may not be null");
            Debug.Assert(database != null, "database may not be null");
            Debug.Assert(datasource != null, "datasource may not be null");
            Debug.Assert(port != 0, "port may not be 0");
            Debug.Assert(dialect != 0, "dialect may not be 0");
            Debug.Assert(charset != null, "charset may not be null");
            Debug.Assert(connectionLifetime != 0, "connectionLifetime may not be 0");
            //Debug.Assert(minPoolSize != 0, "minPoolSize may not be 0");
            Debug.Assert(maxPoolSize != 0, "maxPoolSize may not be 0");
            Debug.Assert(packetSize != 0, "packetSize may not be 0");
            //Debug.Assert(serverType != 0, "serverType may not be 0");



            var configuration = new WebApiConfiguration
            {
                User = user,
                Password = password,
                Database = database,
                DataSource = datasource,
                Port = port,
                Dialect = dialect,
                Charset = charset,
                ConnectionLifetime = connectionLifetime,
                Pooling = pooling,
                MinPoolSize = minPoolSize,
                MaxPoolSize = maxPoolSize,
                PacketSize = packetSize,
                ServerType = serverType
            };

            return configuration;
        }

        /// <summary>
        /// Creates from configuration file.
        /// </summary>
        /// <returns></returns>
        public static WebApiConfiguration CreateFromConfigFile()
        {
            return CreateFrom(
                ConfigurationManager.AppSettings["User"],
                ConfigurationManager.AppSettings["Password"],
                ConfigurationManager.AppSettings["Database"],
                ConfigurationManager.AppSettings["DataSource"],
                Convert.ToInt32(ConfigurationManager.AppSettings["Port"]),
                Convert.ToInt32(ConfigurationManager.AppSettings["Dialect"]),
                ConfigurationManager.AppSettings["Charset"],
                Convert.ToInt32(ConfigurationManager.AppSettings["ConnectionLifetime"]),
                bool.Parse(ConfigurationManager.AppSettings["Pooling"]),
                Convert.ToInt32(ConfigurationManager.AppSettings["MinPoolSize"]),
                Convert.ToInt32(ConfigurationManager.AppSettings["MaxPoolSize"]),
                Convert.ToInt32(ConfigurationManager.AppSettings["PacketSize"]),
                Convert.ToInt32(ConfigurationManager.AppSettings["ServerType"]));
        }
    }
}