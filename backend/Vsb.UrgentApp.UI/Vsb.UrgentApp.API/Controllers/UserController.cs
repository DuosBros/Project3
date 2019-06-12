using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Authentication;
using System.Web;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
    public class UserController : ApiController
    {
        private readonly IIUserTasks userTasks;

        public UserController(
            IIUserTasks userTasks)
        {
            this.userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
        }

        [HttpGet]
        public HttpResponseMessage Get()
        {
            var user = userTasks.GetAuthenticatedUser();

            if (user == null)
            {
                return Request.CreateResponse(HttpStatusCode.Unauthorized);
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.OK, user);
            }
        }
    }
}