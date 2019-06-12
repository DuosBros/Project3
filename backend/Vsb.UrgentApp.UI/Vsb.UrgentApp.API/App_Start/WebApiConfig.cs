using System;
using Castle.Windsor;
using Castle.Windsor.Installer;
using Microsoft.Practices.ServiceLocation;
using System.Net.Http.Formatting;
using System.Web.Hosting;
using System.Web.Http;
using System.Web.Http.Cors;
using FluentNHibernate.Automapping;
using FluentNHibernate.Cfg;
using FluentNHibernate.Conventions;
using SharpArch.NHibernate;
using SharpArch.NHibernate.FluentNHibernate;
using SharpArch.NHibernate.Web.Mvc;
using Vsb.UrgentApp.API.CastleWindsor;
using Vsb.UrgentApp.API.Controllers;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;
using Vsb.UrgentApp.Infrastructure.Db;
using Vsb.UrgentApp.Infrastructure.NHibernateMaps;

namespace Vsb.UrgentApp.API
{
    public static class WebApiConfig
    {
	    /// <summary>
	    /// Initializes the NHibernate web session.
	    /// </summary>
	    /// <param name="session">The session.</param>
	    /// <exception cref="System.Exception">Problem with database connection or configuration.</exception>
	    public static void InitializeNHibernate(WebSessionStorage session)
	    {
		    try
		    {
			    // OperationContext.Current.InstanceContext.Extensions.Add(new SharpArch.Wcf.NHibernate.SessionInstanceExtension);
			    var mappingAssemblies = new[] { HostingEnvironment.MapPath(@"~\bin\Vsb.UrgentApp.Infrastructure.dll") };

			    // nhibernate init (storages: SimpleSessionStorage, WcfSessionStorage, ThreadSessionStorage)
			    NHibernateInitializer.Instance().InitializeNHibernateOnce(() => InitNHibernate(session, mappingAssemblies));
		    }
		    catch (FluentConfigurationException ex)
		    {
			    throw new Exception("Problem with database connection or configuration.", ex);
		    }
	    }

	    private static void InitNHibernate(WebSessionStorage session, string[] mappingAssemblies)
	    {
		    NHibernateSession.Init(
			    session,
			    mappingAssemblies,
			    new AutoPersistenceModelGenerator().Generate(),
			    HostingEnvironment.MapPath(@"~\NHibernate.config"));
	    }


		public static void Init()
		{
			Infrastructure.Db.FireBirdConnection.InitializeFirebird();

			ConfigureJsonFormatter();

			// castle windsor
			IWindsorContainer container = new WindsorContainer();
			container.Install(FromAssembly.This());

			// register components
			ComponentRegistrar.AddComponentsTo(container);

			// service locator
			ServiceLocator.SetLocatorProvider(() => new WindsorServiceLocator(container));

			// dependency resolver
			GlobalConfiguration.Configuration.DependencyResolver = new CastleWindsor.DependencyResolver(container.Kernel);
		}


		public static void Register(HttpConfiguration config)
        {
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);


            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "Auth",
                routeTemplate: "v1/auth",
                defaults: new { controller = "Auth" }
            );

            config.Routes.MapHttpRoute(
                name: "TagEventType",
                routeTemplate: "v1/tageventtypes",
                defaults: new { controller = "TagEventType" }
            );

            config.Routes.MapHttpRoute(
                 name: "Patient",
                 routeTemplate: "v1/patients/{id}",
                 defaults: new {
					controller = "Patient",
					id = RouteParameter.Optional}
             );

            config.Routes.MapHttpRoute(
                 name: "Tag",
                 routeTemplate: "v1/tags/{id}",
                 defaults: new {
					controller = "Tag",
					id = RouteParameter.Optional
				 }
             );

			config.Routes.MapHttpRoute(
				 name: "TagLocations",
				 routeTemplate: "v1/taglocations",
				 defaults: new
				 {
					 controller = "TagLocation"
				 }
			 );

			config.Routes.MapHttpRoute(
                 name: "TagEventByPatientId",
                 routeTemplate: "v1/tagevents",
                 defaults: new {
                     controller = "TagEvent",
                     patientId = RouteParameter.Optional
                 }
             );

            config.Routes.MapHttpRoute(
                name: "GetUser",
                routeTemplate: "v1/users",
                defaults: new
                {
                    controller = "User"
                }
            );

            config.Routes.MapHttpRoute(
                 name: "TagEventByTagId",
                 routeTemplate: "v1/tagevents",
                 defaults: new
                 {
                     controller = "TagEvent",
                     tagId = RouteParameter.Optional
                 }
            );

            config.Routes.MapHttpRoute(
                name: "TagEvents",
                routeTemplate: "v1/tagevents",
                defaults: new
                {
                    controller = "TagEvent"
                }
            );

            config.Routes.MapHttpRoute(
                 name: "TagRegistration",
                 routeTemplate: "v1/tagregistrations/{id}",
                 defaults: new {
					 controller = "TagRegistration",
					 id = RouteParameter.Optional
                 }
             );

            config.Routes.MapHttpRoute(
                 name: "Test",
                 routeTemplate: "v1/test",
                 defaults: new { controller = "Test" }
             );
        }

        private static void ConfigureJsonFormatter()
        {
            var cfg = GlobalConfiguration.Configuration;

            // remove other formatters (the service uses only JSON response)
            // removed: XmlMediaTypeFormatter, JsonMediaTypeFormatter, FormUrlEncodedMediaTypeFormatter, JQueryMvcFormUrlEncodedFormatter
            cfg.Formatters.Clear();
            cfg.Formatters.Add(new JsonMediaTypeFormatter());

            var formatterSettings = cfg.Formatters.JsonFormatter.SerializerSettings;

            FileHelper.SetUpJsonSerializerSettings(formatterSettings);
        }
    }
}
