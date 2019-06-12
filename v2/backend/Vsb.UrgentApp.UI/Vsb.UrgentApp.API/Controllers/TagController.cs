using System.Collections.Generic;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.Tag;

namespace Vsb.UrgentApp.API.Controllers
{
    /// <summary>
    /// The tag controller.
    /// </summary>
    /// <seealso cref="System.Web.Http.ApiController" />
    [Authorize]
    public class TagController : ApiController
    {
		private readonly ITagTasks _tagTasks;

        /// <inheritdoc />
        /// <summary>
        /// Initializes a new instance of the <see cref="T:Vsb.UrgentApp.API.Controllers.TagController" /> class.
        /// </summary>
        /// <param name="tagTasks">The tag tasks.</param>
        public TagController(
			ITagTasks tagTasks
        )
		{
			this._tagTasks = Requires.IsNotNull(tagTasks, nameof(tagTasks));
        }

		/// <summary>
		/// Gets this instance.
		/// </summary>
		/// <returns></returns>
		[HttpGet]
        public List<TagDto> Get()
		{
            List<TagDto> result = _tagTasks.GetAll();

            return result;
        }

		/// <summary>
		/// Gets the specified identifier.
		/// </summary>
		/// <param name="id">The identifier.</param>
		/// <returns></returns>
		public TagDto Get(int id)
		{
		    TagDto result = _tagTasks.Get(id);

		    return result;
		}
    }
}