using System.Collections.Generic;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.TagLocation;

namespace Vsb.UrgentApp.API.Controllers
{
    [Authorize]
    public class TagLocationController : ApiController
    {
        private readonly ITagLocationTasks _tagLocationTasks;

        /// <inheritdoc />
        /// <summary>
        /// Initializes a new instance of the <see cref="T:Vsb.UrgentApp.API.Controllers.TagLocationController" /> class.
        /// </summary>
        /// <param name="tagLocationTasks">The tag location tasks.</param>
        public TagLocationController(
            ITagLocationTasks tagLocationTasks
        )
        {
            this._tagLocationTasks = Requires.IsNotNull(tagLocationTasks, nameof(tagLocationTasks));
        }

        /// <summary>
        /// Gets this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<TagLocationDto> Get()
        {
            List<TagLocationDto> result = _tagLocationTasks.GetAll();

            return result;
        }

        [HttpGet]
        public TagLocationDto GetOne(int id)
        {
            TagLocationDto result = _tagLocationTasks.GetOne(id);

            return result;
        }

        [HttpGet]
        [Route("v2/taglocations")]
        public TagLocationDto GetPatientLatestLocation(int patientId)
        {
            TagLocationDto result = _tagLocationTasks.GetPatientLocations(patientId);

            return result;
        }

        [HttpGet]
        [Route("v2/taglocations")]
        [AllowAnonymous]
        public List<TagLocationDto> GetPatientsLatestLocation(string patientIds)
        {
            List<TagLocationDto> result = new List<TagLocationDto>();

            var splitted = patientIds.Split(',');
            foreach (var s in splitted)
            {
                int res;
                var isSuccess = int.TryParse(s, out res);
                if (isSuccess)
                {
                    TagLocationDto temp = _tagLocationTasks.GetPatientLocations(res);
                    if (temp != null)
                    {
                        result.Add(temp);
                    }
                }
            }

            return result;
        }
    }
}