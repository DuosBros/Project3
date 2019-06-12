using System;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using NLog;
using NLog.Fluent;
using SharpArch.NHibernate.Web.Mvc;
using Vsb.UrgentApp.API.App_Start;

namespace Vsb.UrgentApp.API
{
	public class WebApiApplication : HttpApplication
    {
	    private static Logger Log = LogManager.GetCurrentClassLogger();
	    private WebSessionStorage webSessionStorage;

		public override void Init()
	    {
		    base.Init();
		    this.webSessionStorage = new WebSessionStorage(this);
	    }

		protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            FilterConfig.RegisterGlobalFilters(GlobalConfiguration.Configuration);

			WebApiConfig.Init();
        }

	    protected void Application_BeginRequest(object sender, EventArgs e)
	    {
	        Log.Debug("Before InitializeNHibernate");

		    WebApiConfig.InitializeNHibernate(this.webSessionStorage);

            // DO PICE ZKURVENY CORS VYMRDAT. NEMUZES MIT DUPLIKOVANY CORS ENABLE. BUD TU NEBO V WEBAPICONFIG.CS
            // MRDKA ZASRANA

            //Context.Response.AddHeader(
            //    "Access-Control-Allow-Headers",
            //    "Origin, Authorization, X-Requested-With, Content-Type, Accept, OAuth2Provider, ClientId");

            //Context.Response.AddHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
            //Context.Response.AddHeader("Access-Control-Allow-Credentials", "true");

	        //Response.AppendHeader("Access-Control-Allow-Origin", "*");
            //var origin = (Context.Request.Headers["Origin"] != null) ? Context.Request.Headers["Origin"] : "*";
            //Context.Response.AddHeader("Access-Control-Allow-Origin", origin);

            //if (Context.Request.HttpMethod == "OPTIONS")
            //{
            //    Context.ApplicationInstance.CompleteRequest();
            //}
        }

        /// <summary>
        /// Handles the Application Error.
        /// </summary>
        /// <param name="sender">The source of the event.</param>
        /// <param name="e">The <see cref="EventArgs"/> instance containing the event data.</param>
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Performance", "CA1804:RemoveUnusedLocals", MessageId = "reflectionTypeLoadException", Justification = "Useful for debug.")]
		protected void Application_Error(object sender, EventArgs e)
		{
			Exception exception = Server.GetLastError();

			Log.Debug(exception);

			DisplayErrorPage("Error     " + exception, exception);

			Response.End();
		}

		/// <summary>
		/// Returns a response by executing the Error controller with the specified action.
		/// </summary>
		/// <param name="action">The action.</param>
		/// <param name="exception">The exception.</param>
		private void DisplayErrorPage(string action, Exception exception)
		{

			Context.Items["Exception"] = exception;

			var routeData = new RouteData();
			routeData.Values.Add("controller", "Error");
			routeData.Values.Add("action", action);

			Server.ClearError();
			Response.Clear();

			var httpContext = new HttpContextWrapper(Context);
			var requestContext = new RequestContext(httpContext, routeData);

			IController errorController =
				ControllerBuilder.Current.GetControllerFactory().CreateController(
					new RequestContext(
						httpContext,
						routeData),
						"Error");

			// Clear the query string, in particular toUtc avoid HttpRequestValidationException being re-raised
			// when the error view is rendered by the Error Controller.
			httpContext.RewritePath(httpContext.Request.FilePath, httpContext.Request.PathInfo, string.Empty);

			errorController.Execute(requestContext);
		}
	}
}
