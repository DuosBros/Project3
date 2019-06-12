using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.TagEventType;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
    public class TagEventTypeController : ApiController
    {

        private readonly ITagEventTypeTasks tagEventTypeTasks;
	    private readonly IIUserTasks userTasks;

		public TagEventTypeController(ITagEventTypeTasks tagEventTypeTasks, IIUserTasks userTasks)
        {
            this.tagEventTypeTasks = Requires.IsNotNull(tagEventTypeTasks, nameof(tagEventTypeTasks));
	        this.userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
		}
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<TagEventTypeDto> Get()
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			List<TagEventTypeDto> result = new List<TagEventTypeDto>();

            result = tagEventTypeTasks.GetAll();

            return result;
        }
    }
}