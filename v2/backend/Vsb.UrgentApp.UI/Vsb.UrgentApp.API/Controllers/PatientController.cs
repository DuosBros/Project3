using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.API.Controllers
{
    /// <summary>
    /// The patient controller.
    /// </summary>
    /// <seealso cref="System.Web.Http.ApiController" />
    [Authorize]
    public class PatientController : ApiController
    {
        private readonly IPatientTasks _patientTasks;

        /// <inheritdoc />
        /// <summary>
        /// Initializes a new instance of the <see cref="T:Vsb.UrgentApp.API.Controllers.PatientController" /> class.
        /// </summary>
        /// <param name="patientTasks">The patient tasks.</param>
        /// <param name="userTasks">The user tasks.</param>
        public PatientController(
            IPatientTasks patientTasks
        )
        {
            this._patientTasks = Requires.IsNotNull(patientTasks, nameof(patientTasks));
        }

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<PatientDto> GetAll()
        {
            List<PatientDto> result = new List<PatientDto>();

            result = _patientTasks.GetAll(showDeleted: null, maxPatients: null);

            return result;
        }

        /// <summary>
        /// Gets the specified show deleted.
        /// </summary>
        /// <param name="showDeleted">The show deleted.</param>
        /// <param name="maxPatients">The maximum patients.</param>
        /// <returns></returns>
        /// <exception cref="System.ApplicationException">Name or password is incorrect.</exception>
        [HttpGet]
        public List<PatientDto> Get(bool? showDeleted, int? maxPatients)
        {
            List<PatientDto> result = new List<PatientDto>();

            if (showDeleted.HasValue)
            {
                result = maxPatients.HasValue ? _patientTasks.GetAll(showDeleted.Value, maxPatients.Value) : _patientTasks.GetAll(showDeleted.Value, null);
            }
            else
            {
                result = maxPatients.HasValue ? _patientTasks.GetAll(null, maxPatients.Value) : _patientTasks.GetAll(null, null);
            }
            
            return result;
        }

        /// <summary>
        /// Posts the specified patient.
        /// </summary>
        /// <param name="patient">The patient.</param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentNullException">patient</exception>
        [HttpPost]
        public HttpResponseMessage Post(PatientDto patient)
        {
            if (patient == null)
            {
                throw new ArgumentNullException(nameof(patient));
            }

            PatientDto result = _patientTasks.Create(patient);

            return Request.CreateResponse(HttpStatusCode.Created, result);
        }

        /// <summary>
        /// Puts the specified patient.
        /// </summary>
        /// <param name="patient">The patient.</param>
        /// <returns></returns>
        [HttpPut]
        public HttpResponseMessage Put(PatientDto patient)
        {
            _patientTasks.Update(patient);

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        /// <summary>
        /// Deletes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <returns></returns>
        [HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            _patientTasks.Delete(id);

            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}