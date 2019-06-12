using System.Web.Http;
using System.Web.Routing;

namespace Vsb.UrgentApp.API.App_Start
{
    public class RouteConfig
    {
        /// <summary>
        /// Registers the routes.
        /// </summary>
        /// <param name="routes">The routes.</param>
        public static void RegisterRoutes(RouteCollection routes)
        {

            routes.MapHttpRoute(
                name: "TagEventType",
                routeTemplate: "v2/tageventtypes",
                defaults: new { controller = "TagEventType" }
            );

            routes.MapHttpRoute(
                 name: "Patient",
                 routeTemplate: "v2/patients/{id}",
                 defaults: new
                 {
                     controller = "Patient",
                     id = RouteParameter.Optional,
                     showDeleted = RouteParameter.Optional,
                     maxPatients = RouteParameter.Optional
                 }
             );

            routes.MapHttpRoute(
                 name: "Tag",
                 routeTemplate: "v2/tags/{id}",
                 defaults: new
                 {
                     controller = "Tag",
                     id = RouteParameter.Optional
                 }
             );

            routes.MapHttpRoute(
                 name: "TagLocations",
                 routeTemplate: "v2/taglocations/{id}",
                 defaults: new
                 {
                     controller = "TagLocation",
                     id = RouteParameter.Optional
                 }
             );

            routes.MapHttpRoute(
                 name: "TagEventByPatientId",
                 routeTemplate: "v2/tagevents",
                 defaults: new
                 {
                     controller = "TagEvent",
                     patientId = RouteParameter.Optional
                 }
             );

            routes.MapHttpRoute(
                name: "Users",
                routeTemplate: "v2/users",
                defaults: new
                {
                    controller = "User"
                }
            );

            routes.MapHttpRoute(
                name: "Graphs",
                routeTemplate: "v2/graphs/{action}",
                defaults: new
                {
                    controller = "Graph"
                }
            );

            routes.MapHttpRoute(
                 name: "TagEventByTagId",
                 routeTemplate: "v2/tagevents",
                 defaults: new
                 {
                     controller = "TagEvent",
                     tagId = RouteParameter.Optional
                 }
            );

            routes.MapHttpRoute(
                name: "TagEvents",
                routeTemplate: "v2/tagevents",
                defaults: new
                {
                    controller = "TagEvent"
                }
            );

            routes.MapHttpRoute(
                 name: "TagRegistration",
                 routeTemplate: "v2/tagregistrations/{id}",
                 defaults: new
                 {
                     controller = "TagRegistration",
                     id = RouteParameter.Optional
                 }
             );

            routes.MapHttpRoute(
                 name: "Test",
                 routeTemplate: "v2/test",
                 defaults: new { controller = "Test" }
             );
        }
    }
}