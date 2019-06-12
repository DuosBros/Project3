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
    public class PatientController : ApiController
    {
		private readonly IPatientTasks patientTasks;
        private readonly IIUserTasks userTasks;

        /// <summary>
        /// Initializes a new instance of the <see cref="PatientController"/> class.
        /// </summary>
        /// <param name="patientTasks">The patient tasks.</param>
        public PatientController(
			IPatientTasks patientTasks,
            IIUserTasks userTasks
        )
		{
			this.patientTasks = Requires.IsNotNull(patientTasks, nameof(patientTasks));
            this.userTasks = Requires.IsNotNull(userTasks, nameof(userTasks));
        }

        [HttpGet]
        public List<PatientDto> Get()
        {
            userTasks.GetAuthenticatedUser();

            List<PatientDto> result = new List<PatientDto>();

			// with nhibernate
            // result = patientTasks.GetAll();
            
			//with datasets
	        result = patientTasks.GetAllWithoutNHibernate();

			return result;
        }

        /// <summary>
        /// Gets this instance.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public List<PatientDto> Get(bool? showDeleted, int? maxPatients)
        {
            var user = userTasks.GetAuthenticatedUser();

            if (user == null)
                throw new ApplicationException("Name or password is incorrect.");

            List<PatientDto> result = new List<PatientDto>();

            if (showDeleted.HasValue)
            {
                result = patientTasks.GetFilteredPatients(showDeleted.Value, maxPatients);
            }
            else
            {
                result = patientTasks.GetAll();
            }
            
            return result;
        }

        /// <summary>
        /// Posts the specified patient.
        /// </summary>
        /// <param name="action"></param>
        /// <param name="patient">The patient.</param>
        /// <returns></returns>
        /// <exception cref="System.ArgumentNullException">patient</exception>
        [HttpPost]
        public HttpResponseMessage Post(string action, PatientDto patient)
        {
            var user = userTasks.GetAuthenticatedUser();

            if (user == null)
                throw new ApplicationException("Name or password is incorrect.");

            PatientDto result = new PatientDto();

            if (!string.IsNullOrEmpty(action))
            {
                if (patient == null)
                {
                    throw new ArgumentNullException(nameof(patient));
                }

                if (action.Contains("current"))
                {
                    result = patientTasks.Create(patient, true);
                }
                else if (action.Contains("past"))
                {
                    result = patientTasks.Create(patient, false);
                }
                else
                {
                    throw new ApplicationException(string.Format("Action {0} not supported", action));   
                }
            }
			

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
            var user = userTasks.GetAuthenticatedUser();

            if (user == null)
                throw new ApplicationException("Name or password is incorrect.");

            patientTasks.Update(patient);

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
            var user = userTasks.GetAuthenticatedUser();

            if (user == null)
                throw new ApplicationException("Name or password is incorrect.");

            patientTasks.Delete(id);

            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}