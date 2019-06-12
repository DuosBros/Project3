using System;
using NUnit.Framework;
using Castle.Windsor;
using Microsoft.Practices.ServiceLocation;
using Vsb.UrgentApp.API.CastleWindsor;
using Castle.Windsor.Installer;

namespace Vsb.UrgentApp.Tests.Common
{
	[SetUpFixture]
	public class IntegrationTestsBase : IDisposable
	{
		private IWindsorContainer container;

		[SetUp]
		public void RunBeforeAnyTests()
		{
			container = new WindsorContainer();
			container.Install(FromAssembly.This());
			ComponentRegistrar.AddComponentsTo(container);
			ServiceLocator.SetLocatorProvider(() => new WindsorServiceLocator(container));
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
