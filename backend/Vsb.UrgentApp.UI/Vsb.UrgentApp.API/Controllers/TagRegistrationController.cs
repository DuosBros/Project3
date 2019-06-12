using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Tasks.TagRegistration;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
    public class TagRegistrationController : ApiController
    {

        private readonly ITagRegistrationTasks tagRegistrationTasks;
		private readonly IBaseMapper baseMapper;
	    private readonly IIUserTasks userTasks;

		/// <summary>
		/// Initializes a new instance of the <see cref="TagRegistrationController"/> class.
		/// </summary>
		/// <param name="tagRegistrationTasks"></param>
		/// <param name="baseMapper"></param>
		/// <param name="userTasks"></param>
		public TagRegistrationController(
			ITagRegistrationTasks tagRegistrationTasks,
			IBaseMapper baseMapper,
			IIUserTasks userTasks
		)
		{
			this.tagRegistrationTasks = Requires.IsNotNull(tagRegistrationTasks, nameof(tagRegistrationTasks));
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
			this.userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
		}

		/// <summary>
		/// Gets this instance.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
        public List<TagRegistrationDto> Get()
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			List<TagRegistrationDto> result = tagRegistrationTasks.GetAll();

            return result;
        }

        [HttpGet]
        public TagRegistrationDto Get(int patientId)
        {
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			TagRegistrationDto result = tagRegistrationTasks.GetByPatientId(patientId);

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
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			if (tagRegistration == null)
            {
                throw new ArgumentNullException(nameof(tagRegistration));
            }

            var result = tagRegistrationTasks.Create(tagRegistration);

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
	        var user = userTasks.GetAuthenticatedUser();

	        if (user == null)
		        throw new ApplicationException("Name or password is incorrect.");

			tagRegistrationTasks.Delete(id);

			return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}