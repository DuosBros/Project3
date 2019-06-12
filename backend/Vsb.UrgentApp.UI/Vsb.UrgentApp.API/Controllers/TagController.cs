using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
    public class TagController : ApiController
    {
		private readonly ITagTasks tagTasks;
        private readonly IIUserTasks userTasks;

        /// <summary>
        /// Initializes a new instance of the <see cref="TagController"/> class.
        /// </summary>
        /// <param name="tagTasks">The tag tasks.</param>
        public TagController(
			ITagTasks tagTasks,
            IIUserTasks userTasks
        )
		{
			this.tagTasks = Requires.IsNotNull(tagTasks, nameof(tagTasks));
		    this.userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
        }

		/// <summary>
		/// Gets this instance.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
        public List<TagDto> Get()
		{
            userTasks.GetAuthenticatedUser();

            List<TagDto> result = tagTasks.GetAll();

            return result;
        }

		/// <summary>
		/// Gets the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		public TagDto Get(int id)
		{
            userTasks.GetAuthenticatedUser();

            TagDto result = new TagDto();

			result = tagTasks.GetById(id);

			return result;
		}
    }
}