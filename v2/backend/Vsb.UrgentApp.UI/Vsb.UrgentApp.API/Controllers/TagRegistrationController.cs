using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.TagRegistration;

namespace Vsb.UrgentApp.API.Controllers
{
    [Authorize]
    public class TagRegistrationController : ApiController
    {

        private readonly ITagRegistrationTasks _tagRegistrationTasks;

		/// <inheritdoc />
		/// <summary>
		/// Initializes a new instance of the <see cref="T:Vsb.UrgentApp.API.Controllers.TagRegistrationController" /> class.
		/// </summary>
		/// <param name="tagRegistrationTasks"></param>
		public TagRegistrationController(
			ITagRegistrationTasks tagRegistrationTasks
		)
		{
			_tagRegistrationTasks = Requires.IsNotNull(tagRegistrationTasks, nameof(tagRegistrationTasks));
		}

		/// <summary>
		/// Gets this instance.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
        public List<TagRegistrationDto> Get()
        {
			List<TagRegistrationDto> result = _tagRegistrationTasks.GetAll();

            return result;
        }

        [HttpGet]
        public TagRegistrationDto Get(int patientId)
        {
			TagRegistrationDto result = _tagRegistrationTasks.GetByPatientId(patientId);

            return result;
        }

        /// <summary>
        /// Posts the specified tag registration.
        /// </summary>
        /// <param name="tagRegistration">The tag registration.</param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentNullException">tagRegistration</exception>
        [HttpPost]
        public HttpResponseMessage Post(TagRegistrationDto tagRegistration)
        {
			if (tagRegistration == null)
            {
                throw new ArgumentNullException(nameof(tagRegistration));
            }

            var result = _tagRegistrationTasks.Create(tagRegistration);

            return Request.CreateResponse(HttpStatusCode.Created, result);
        }

        /// <summary>
        /// Deletes the specified patient identifier.
        /// </summary>
        /// <param name="id">The patient identifier.</param>
        /// <returns></returns>
        
        [HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
			_tagRegistrationTasks.Delete(id);

			return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}