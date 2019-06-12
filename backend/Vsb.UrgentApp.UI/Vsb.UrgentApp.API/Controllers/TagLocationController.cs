using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.TagLocation;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
	public class TagLocationController : ApiController
	{
		private readonly ITagLocationTasks tagLocationTasks;
		private readonly IIUserTasks userTasks;

		/// <summary>
		/// Initializes a new instance of the <see cref="TagLocationController"/> class.
		/// </summary>
		/// <param name="tagLocationTasks">The tag location tasks.</param>
		public TagLocationController(
			ITagLocationTasks tagLocationTasks,
			IIUserTasks userTasks
		)
		{
			this.tagLocationTasks = Requires.IsNotNull(tagLocationTasks, nameof(tagLocationTasks));
			this.userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
		}

		/// <summary>
		/// Gets this instance.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		public List<TagLocationDto> Get()
		{
			var user = userTasks.GetAuthenticatedUser();

			if (user == null)
				throw new ApplicationException("Name or password is incorrect.");

			List<TagLocationDto> result = tagLocationTasks.GetAll();

			return result;
		}
	}
}