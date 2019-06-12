using System;
using FirebirdSql.Data.FirebirdClient;
using System.Data;
using NLog;
using Vsb.UrgentApp.Infrastructure.Configuration;

namespace Vsb.UrgentApp.Infrastructure.Db
{
    public class FireBirdConnection
    {
	    private static Logger Log = LogManager.GetCurrentClassLogger();

		public static FbConnection Connection { get; private set; }

        public static string ConnectionString()
        {
            WebApiConfiguration config = WebApiConfiguration.CreateFromConfigFile();

            string connectionString =
               "User={0};" +
               "Password={1};" +
               @"Database={2};" +
               "DataSource={3};" +
               "Port={4};" +
               "Dialect={5};" +
               "Charset={6};" +
               "Role=;" +
               "Connection lifetime={7};" +
               "Pooling={8};" +
               "MinPoolSize={9};" +
               "MaxPoolSize={10};" +
               "Packet Size={11};" +
               "ServerType={12}";

            connectionString = string.Format(
                connectionString,
                config.User,
                config.Password,
                config.Database,
                config.DataSource,
                config.Port,
                config.Dialect,
                config.Charset,
                config.ConnectionLifetime,
                config.Pooling,
                config.MinPoolSize,
                config.MaxPoolSize,
                config.PacketSize,
                config.ServerType);

            return connectionString;
        }

        public static void InitializeFirebird()
        {
            string connectionString = ConnectionString();
            FbConnection databaseConnection = new FbConnection(connectionString);
            databaseConnection.Open();
            Connection = databaseConnection;

			Log.Info("Database connection established.");
        }

		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2100:Review SQL queries for security vulnerabilities")]
		public static void ExecuteQuery(FbConnection connection, string query)
		{
			using (FbTransaction mtransaction = Connection.BeginTransaction())
			{

				FbCommand cmd = new FbCommand(query, connection, mtransaction);

				try
				{
					cmd.ExecuteNonQuery();
					mtransaction.Commit();
				}
				catch(Exception ex)
				{
					mtransaction.Rollback();
					throw ex;
				}
				finally
				{
					cmd.Dispose();			
					mtransaction.Dispose();
				}
			}

		}

		public static void ExecuteQuery(FbConnection connection, string query, FbTransaction trans)
		{
			FbCommand cmd = new FbCommand(query, connection, trans);
			try
			{
				cmd.ExecuteNonQuery();
			}
			finally
			{
				cmd.Dispose();
			}
		}


		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2100:Review SQL queries for security vulnerabilities")]
		public static void SelectQuery(FbConnection connection, DataTable table, string query)
		{
			using (FbConnection c = new FbConnection(ConnectionString()))
			{
				c.Open();
				using (FbTransaction trans = c.BeginTransaction())
				{
					try
					{
						using (FbCommand cmd = new FbCommand(query, c, trans))
						{
							var reader = cmd.ExecuteReader();
							table.Load(reader);
						}

						trans.Commit();
					}
					catch
					{
						trans.Rollback();
						trans.Dispose();
						
					}


				}
			}

			//using (FbTransaction mtransaction = Connection.BeginTransaction())
			//{
			//	FbCommand cmd = new FbCommand(query, connection, mtransaction);
			//	cmd.Transaction = mtransaction;
			//	try
			//	{
			//		FbDataReader myreader = cmd.ExecuteReader();
			//		try
			//		{
			//			table.Load(myreader);
			//		}
			//		finally
			//		{
			//			myreader.Close();
			//		}
			//	}
			//	catch
			//	{
			//		mtransaction.Rollback();
			//	}
			//	finally
			//	{
			//		mtransaction.Dispose();
			//		cmd.Dispose();
			//	}
			//}

		
		}

		public static void SelectQuery(FbConnection connection, DataTable table, string query, FbTransaction trans)
		{
			FbCommand cmd = new FbCommand(query, connection, trans);
			try
			{
				FbDataReader myreader = cmd.ExecuteReader();
				try
				{
					table.Load(myreader);
				}
				finally
				{
					myreader.Close();
				}
			}
			finally
			{
				cmd.Dispose();
			}
		}
	}
}
