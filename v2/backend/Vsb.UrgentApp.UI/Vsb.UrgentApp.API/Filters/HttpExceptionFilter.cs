using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Authentication;
using System.Web;
using System.Web.Http.Filters;
using NLog;

namespace Vsb.UrgentApp.API.Filters
{
    public class HttpExceptionFilter : ExceptionFilterAttribute
    {
		private static Logger Log = LogManager.GetCurrentClassLogger();

		public override void OnException(HttpActionExecutedContext context)
        {
            var mainException = context.Exception;
            var message = context.Exception.Message;

            if (context.Exception.InnerException != null)
            {
                message += " - " + context.Exception.InnerException.Message;
                if (context.Exception is AggregateException)
                {
                    mainException = context.Exception.InnerException;
                }
            }

            Log.Debug(string.Format("Rest v1: {0}{1} exception message: {2}. Arguments: {3}",
	            context.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName,
	            context.Request.Method,
	            message,
	            context.ActionContext.ActionArguments.ToString()));
            

            Log.Error(context.Exception);

            if (mainException is NotImplementedException)
            {
                context.Response = context.Request.CreateResponse(
                    HttpStatusCode.NotImplemented,
                    new
                    {
                        Message =
                            $"This {context.Request.Method} method for " +
                            $"resource {context.ActionContext.ActionDescriptor.ControllerDescriptor.ControllerName} is not yet implemented.",
                        Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                    });
            }
            else if (mainException is AuthenticationException)
            {
                context.Response = context.Request.CreateResponse(
                    HttpStatusCode.Unauthorized,
                    new
                    {
                        Message = message,
                        Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                    });
            }
            else if (mainException is UnauthorizedAccessException)
            {
                context.Response = context.Request.CreateResponse(
                    HttpStatusCode.Unauthorized,
                    new
                    {
                        Message = message,
                        Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                    });
            }
            //else if (mainException is ResourceNotFoundException)
            //{
            //    context.Response = context.Request.CreateResponse(
            //        HttpStatusCode.NotFound,
            //        new
            //        {
            //            Message = message,
            //            Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            //        });
            //}
            else if (
                mainException is ApplicationException ||
                mainException is ArgumentNullException ||
                mainException is ArgumentException ||
                mainException is NullReferenceException)
            {
                context.Response = context.Request.CreateResponse(
                    HttpStatusCode.BadRequest,
                    new
                    {
                        Message = message,
                        Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                    });
            }
            else
            {
                context.Response = context.Request.CreateResponse(
                    HttpStatusCode.InternalServerError,
                    new
                    {
                        Message = "Unexpected internal server error has occured",
                        Timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
                    });
            }
        }
    }
}