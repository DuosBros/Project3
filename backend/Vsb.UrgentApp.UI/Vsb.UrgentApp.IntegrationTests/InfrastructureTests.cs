using System;
using Castle.Core.Internal;
using Vsb.UrgentApp.Tests.Common;
using NUnit.Framework;
using Vsb.UrgentApp.Infrastructure.Configuration;
using Castle.Windsor;
using Vsb.UrgentApp.API.CastleWindsor;
using Castle.Windsor.Installer;

namespace Vsb.UrgentApp.IntegrationTests
{
	public class InfrastructureTests : IntegrationTestsBase
	{
		private IWindsorContainer container;

		[Test]
		public void ResetDb_void_success()
		{
			ConnectToFBDb_void_success();
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

		[Test]
		public void ConnectToFBDb_void_success()
		{
			try
			{
				Infrastructure.Db.FireBirdConnection.InitializeFirebird();
			}
			catch (Exception ex)
			{
				Assert.Fail("Expected no exception, but got: " + ex.Message);
			}
		}

		[Test]
		public void ResetDatabaseData_void_success()
		{
			Infrastructure.Db.FireBirdConnection.InitializeFirebird();

			string[] content = System.IO.File.ReadAllLines(@"..\..\ResetData.txt");

			foreach (var item in content)
			{
				Infrastructure.Db.FireBirdConnection.ExecuteQuery(
					Infrastructure.Db.FireBirdConnection.Connection, 
					item
					);
			}

			Infrastructure.Db.FireBirdConnection.Connection.Dispose();
		}

		[Test]
		public void FillData_void_success()
		{
			Infrastructure.Db.FireBirdConnection.InitializeFirebird();

			string[] content = System.IO.File.ReadAllLines(@"..\..\FillData.txt");

			foreach (var item in content)
			{
				if (!item.IsNullOrEmpty())
				{
					Infrastructure.Db.FireBirdConnection.ExecuteQuery(
						Infrastructure.Db.FireBirdConnection.Connection,
						item
					);	
				}
			}

			Infrastructure.Db.FireBirdConnection.Connection.Dispose();
		}

		[Test]
		public void ResetGenerator_void_success()
		{
			Infrastructure.Db.FireBirdConnection.InitializeFirebird();

			string[] content = System.IO.File.ReadAllLines(@"..\..\ResetGenerators.txt");

			foreach (var item in content)
			{
				Infrastructure.Db.FireBirdConnection.ExecuteQuery(
					Infrastructure.Db.FireBirdConnection.Connection,
					item
				);
			}

			Infrastructure.Db.FireBirdConnection.Connection.Dispose();
		}

		[Test]
		public void InitWindsorCastle_void_success()
		{
			try
			{
				container = new WindsorContainer();
				container.Install(FromAssembly.This());
				ComponentRegistrar.AddComponentsTo(container);
			}
			catch (Exception ex)
			{
				Assert.Fail("Expected no exception, but got: " + ex.Message);
			}
		}
	}
}
