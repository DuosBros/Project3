using System.Web.Http;
using System.Web.Mvc;

namespace Vsb.UrgentApp.API.App_Start
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(HttpConfiguration config)
        {
            config.MessageHandlers.Add(new TokenValidationHandler());
            config.MessageHandlers.Add(new LogRequestAndResponseHandler());
            config.Filters.Add(new Filters.HttpExceptionFilter());
        }
    }
}