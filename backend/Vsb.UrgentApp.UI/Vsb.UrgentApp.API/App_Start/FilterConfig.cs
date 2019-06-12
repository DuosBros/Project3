using System.Web.Http;
using System.Web.Mvc;

namespace Vsb.UrgentApp.API.App_Start
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(HttpConfiguration config)
        {
			config.Filters.Add(new Filters.HttpExceptionFilter());
        }
    }
}