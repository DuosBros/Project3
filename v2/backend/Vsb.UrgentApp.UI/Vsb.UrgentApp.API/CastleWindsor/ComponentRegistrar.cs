// I believe too: http://groups.google.com/group/sharp-architecture/tree/browse_frm/month/2011-1/2070e77d2f339315

using System.Web.Http;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Infrastructure.Configuration;
using Vsb.UrgentApp.Common.Mappers;

namespace Vsb.UrgentApp.API.CastleWindsor
{
    /// <summary>
    /// Class to define components to be registered in the IoC container.
    /// </summary>
    public static class ComponentRegistrar
	{
		/// <summary>
		/// Adds the components to be registered.
		/// </summary>
		/// <param name="container">The container.</param>
		public static void AddComponentsTo(IWindsorContainer container)
		{
			// register SharpArch SessionFactoryKeyProvider
			container.Register(
				Component.For(typeof(ISessionFactoryKeyProvider))
					.ImplementedBy(typeof(DefaultSessionFactoryKeyProvider))
					.Named("sessionFactoryKeyProvider"));

			// register repositories
			container.Register(
				Classes
					.FromAssemblyNamed("Vsb.UrgentApp.Infrastructure")
					.TypesImplementingInterfacesIn("Vsb.UrgentApp.Domain.Infrastructure.Repositories")
					.WithService.FirstNonGenericInterface());

			// register mappers in infrastructure layer
			container.Register(
				Classes
					.FromAssemblyNamed("Vsb.UrgentApp.Infrastructure")
					.Where(d => d.Namespace != null && d.Namespace.EndsWith(".Mappers"))
					 .WithService.FirstNonGenericInterface());

			// register tasks and mappers
			container.Register(
				Classes
					.FromAssemblyNamed("Vsb.UrgentApp.Tasks")
					.TypesImplementingInterfacesIn("Vsb.UrgentApp.Tasks")
					.WithService.FirstNonGenericInterface());

			// register controllers
			container.Register(
				Classes
					.FromThisAssembly()
					.BasedOn<ApiController>()
					.LifestyleScoped()
				);

			// register App Config types
			IWebApiConfiguration configuration = WebApiConfiguration.CreateFromConfigFile();

			container.Register(Component.For<IWebApiConfiguration>().Instance(configuration));
		}
	}
}