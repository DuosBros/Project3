
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.TagEvent;

namespace Vsb.UrgentApp.API.Controllers
{
    public class TagEventController : ApiController
    {
        private readonly ITagEventTask _tagEventTasks;

        /// <inheritdoc />
        /// <summary>
        /// Initializes a new instance of the <see cref="T:Vsb.UrgentApp.API.Controllers.TagEventController" /> class.
        /// </summary>
        /// <param name="tagEventTasks">The tag event tasks.</param>
        public TagEventController(
			ITagEventTask tagEventTasks
		)
        {
			_tagEventTasks = Requires.IsNotNull(tagEventTasks, nameof(tagEventTasks));
		}

        /// <summary>
        /// Gets this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<TagEventDto> Get()
        {
			List<TagEventDto> result = _tagEventTasks.GetAll();

            return result;
        }

        [HttpGet]
        public List<TagEventDto> Get(int? patientId)
        {
			List<TagEventDto> result = patientId.HasValue ? 
                _tagEventTasks.GetByPatientId(patientId.Value) : new List<TagEventDto>();
            
            return result;
        }

        [HttpGet]
        public List<TagEventDto> Get(int tagId)
        {
			List<TagEventDto> result = tagId != 0 ?
                _tagEventTasks.GetByTagId(tagId) : new List<TagEventDto>();

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
			if (tagEvent == null)
            {
                throw new ArgumentNullException(nameof(tagEvent));
            }

            var result = _tagEventTasks.Create(tagEvent);

            return Request.CreateResponse(HttpStatusCode.Created, result);
        }

        [HttpPut]
        public HttpResponseMessage Put(List<TagEventDto> tagEvents)
        {
			List<TagEventDto> result = new List<TagEventDto>();

            if (tagEvents == null)
            {
                throw new ArgumentNullException(nameof(tagEvents));
            }

            foreach (var tagEvent in tagEvents)
            {
                result.Add(_tagEventTasks.Update(tagEvent));
            }

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }
    }
}