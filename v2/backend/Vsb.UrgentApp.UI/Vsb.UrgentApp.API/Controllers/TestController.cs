using System.Web.Http;

namespace Vsb.UrgentApp.API.Controllers
{
    public class TestController : ApiController
    {
        /// <summary>
        /// Gets the app status.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public string Get()
        {
            return "OK";
        }
    }
}