using System;
using System.Web;
using System.Web.Hosting;
using NUnit.Framework;
using Castle.Windsor;
using Microsoft.Practices.ServiceLocation;
using Vsb.UrgentApp.API.CastleWindsor;
using Castle.Windsor.Installer;
using SharpArch.NHibernate;
using SharpArch.NHibernate.Web.Mvc;
using Vsb.UrgentApp.API;
using Vsb.UrgentApp.Infrastructure.NHibernateMaps;

namespace Vsb.UrgentApp.Tests.Common
{
	[SetUpFixture]
	public class IntegrationTestsBase : IDisposable
	{
		private IWindsorContainer container;
   
        [SetUp]
		public void RunBeforeAnyTests()
		{
            WebApiConfig.Init();


		    // castle windsor init
		    this.container = new WindsorContainer();
		    ComponentRegistrar.AddComponentsTo(this.container);
		    ServiceLocator.SetLocatorProvider(() => new WindsorServiceLocator(this.container));

		    var mappingAssemblies = new[] { AppDomain.CurrentDomain.BaseDirectory + @"\Vsb.UrgentApp.Infrastructure.dll"};

            // sharparch nhibernate storages: SimpleSessionStorage, WcfSessionStorage, ThreadSessionStorage
            NHibernateInitializer.Instance().InitializeNHibernateOnce(() => NHibernateSession.Init(
		        new SimpleSessionStorage(),
		        mappingAssemblies,
		        new AutoPersistenceModelGenerator().Generate(),
		        AppDomain.CurrentDomain.BaseDirectory + @"\NHibernate.config"));
        }

		[TearDown]
		public virtual void RunAfterAllTests()
		{
			Dispose();
		}

		public void Dispose()
		{
			Dispose(true);
			GC.SuppressFinalize(this);
		}

		protected virtual void Dispose(bool disposing)
		{
			if (disposing && container != null)
			{
				container.Dispose();
				container = null;
			}
		}
	}
}
