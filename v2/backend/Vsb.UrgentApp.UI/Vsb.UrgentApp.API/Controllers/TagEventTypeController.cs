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
    [Authorize]
    public class TagEventTypeController : ApiController
    {

        private readonly ITagEventTypeTasks _tagEventTypeTasks;

		public TagEventTypeController(ITagEventTypeTasks tagEventTypeTasks)
        {
            this._tagEventTypeTasks = Requires.IsNotNull(tagEventTypeTasks, nameof(tagEventTypeTasks));

		}

        /// <summary>
        /// Gets this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<TagEventTypeDto> Get()
        {
            var result = _tagEventTypeTasks.GetAll();

            return result;
        }
    }
}