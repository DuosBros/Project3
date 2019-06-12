using System;
using Castle.Core.Internal;
using Vsb.UrgentApp.Tests.Common;
using NUnit.Framework;
using Vsb.UrgentApp.Infrastructure.Configuration;
using Castle.Windsor;
using Vsb.UrgentApp.API.CastleWindsor;
using Castle.Windsor.Installer;
using NHibernate;
using SharpArch.NHibernate;
using Vsb.UrgentApp.API;

namespace Vsb.UrgentApp.IntegrationTests
{
	public class InfrastructureTests : IntegrationTestsBase
	{
		private IWindsorContainer _container;

		[Test]
		public void ResetDb_void_success()
		{
			ResetGenerator_void_success();
			ResetDatabaseData_void_success();
			FillData_void_success();
		}

		[Test]
		public void InitConfig_void_success()
		{
			try
			{
				IWebApiConfiguration configuration = WebApiConfiguration.CreateFromConfigFile();
				Assert.IsNotNull(configuration);
			}
			catch (Exception ex)
			{
				Assert.Fail("Expected no exception, but got: " + ex.Message);
			}
		}
           
		public void ResetDatabaseData_void_success()
		{
			string[] content = System.IO.File.ReadAllLines(@"..\..\ResetData.txt");

		    ISession session = NHibernateSession.GetDefaultSessionFactory().OpenSession();

            foreach (var item in content)
			{
			    session.CreateSQLQuery(item).ExecuteUpdate();
            }

            session.Flush();
		    session.Dispose();
		}
        
		public void FillData_void_success()
		{

			string[] content = System.IO.File.ReadAllLines(@"..\..\FillData.txt");

		    ISession session = NHibernateSession.GetDefaultSessionFactory().OpenSession();

		    foreach (var item in content)
		    {
                if (!string.IsNullOrEmpty(item))
                {
		            session.CreateSQLQuery(item).ExecuteUpdate();
                }
		    }

		    session.Dispose();
        }

		public void ResetGenerator_void_success()
		{

			string[] content = System.IO.File.ReadAllLines(@"..\..\ResetGenerators.txt");

		    ISession session = NHibernateSession.GetDefaultSessionFactory().OpenSession();

		    foreach (var item in content)
		    {
		        session.CreateSQLQuery(item).ExecuteUpdate();
		    }

		    session.Dispose();
        }

		[Test]
		public void InitWindsorCastle_void_success()
		{
			try
			{
				_container = new WindsorContainer();
				_container.Install(FromAssembly.This());
				ComponentRegistrar.AddComponentsTo(_container);
			}
			catch (Exception ex)
			{
				Assert.Fail("Expected no exception, but got: " + ex.Message);
			}
		}
	}
}
