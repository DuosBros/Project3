
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.TagEvent;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
    public class TagEventController : ApiController
    {
        private readonly ITagEventTask tagEventTasks;
	    private readonly IIUserTasks userTasks;

		/// <summary>
		/// Initializes a new instance of the <see cref="TagEventController"/> class.
		/// </summary>
		public TagEventController(
			ITagEventTask tagEventTasks,
			IIUserTasks userTasks
		)
        {
			this.tagEventTasks = Requires.IsNotNull(tagEventTasks, nameof(tagEventTasks));
			this.userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
		}

        /// <summary>
        /// Gets this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<TagEventDto> Get()
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			List<TagEventDto> result = tagEventTasks.GetAll();

            return result;
        }

        [HttpGet]
        public List<TagEventDto> Get(int? patientId)
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			List<TagEventDto> result = patientId.HasValue ? 
                tagEventTasks.GetByPatientId(patientId.Value) : new List<TagEventDto>();
            
            return result;
        }

        [HttpGet]
        public List<TagEventDto> Get(int tagId)
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			List<TagEventDto> result = tagId != 0 ?
                tagEventTasks.GetByTagId(tagId) : new List<TagEventDto>();

            return result;
        }

        /// <summary>
        /// Posts the specified tag event.
        /// </summary>
        /// <param name="tagEvent">The tag event.</param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentNullException">
        /// tagEvent
        /// or
        /// TagEvent
        /// </exception>
        [HttpPost]
        public HttpResponseMessage Post(TagEventDto tagEvent)
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			if (tagEvent == null)
            {
                throw new ArgumentNullException(nameof(tagEvent));
            }

            tagEventTasks.Create(tagEvent);

            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [HttpPut]
        public HttpResponseMessage Put(List<TagEventDto> tagEvents)
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			List<TagEventDto> result = new List<TagEventDto>();

            if (tagEvents == null)
            {
                throw new ArgumentNullException(nameof(tagEvents));
            }

            foreach (var tagEvent in tagEvents)
            {
                result.Add(tagEventTasks.Update(tagEvent));
            }

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}