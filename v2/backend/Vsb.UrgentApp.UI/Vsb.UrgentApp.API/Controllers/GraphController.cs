using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.TagEvent;
using Vsb.UrgentApp.Tasks.TagEventType;
using Vsb.UrgentApp.Tasks.TagLocation;

namespace Vsb.UrgentApp.API.Controllers
{
    [Authorize]
    public class GraphController : ApiController
    {
        private readonly IPatientTasks _patientTasks;
        private readonly ITagEventTypeTasks _tagEventTypeTasks;
        private readonly ITagEventTask _tagEventTasks;
        private readonly ITagLocationTasks _tagLocationTasks;

        /// <inheritdoc />
        /// <summary>
        /// Initializes a new instance of the <see cref="T:Vsb.UrgentApp.API.Controllers.PatientController" /> class.
        /// </summary>
        /// <param name="patientTasks">The patient tasks.</param>
        /// <param name="tagEventTypeTasks"></param>
        /// <param name="tagEventTasks"></param>
        /// <param name="tagLocationTasks"></param>
        public GraphController(
            IPatientTasks patientTasks,
            ITagEventTypeTasks tagEventTypeTasks,
            ITagEventTask tagEventTasks,
            ITagLocationTasks tagLocationTasks
        )
        {
            this._patientTasks = Requires.IsNotNull(patientTasks, nameof(patientTasks));
            this._tagEventTypeTasks = Requires.IsNotNull(tagEventTypeTasks, nameof(tagEventTypeTasks));
            this._tagEventTasks = Requires.IsNotNull(tagEventTasks, nameof(tagEventTasks));
            this._tagLocationTasks = Requires.IsNotNull(tagLocationTasks, nameof(tagLocationTasks));
        }

        [HttpGet]
        [ActionName("tagevent")]
        public List<object> GetAllTagEventTimes()
        {
            List<object> result = new List<object>();

            List<double> casy1Udalosti = new List<double>();
            List<double> casy2Udalosti = new List<double>();

            var tagEventTypes = _tagEventTypeTasks.GetAll();

            var deletedPatients = _patientTasks.GetAll(true, null);

            foreach (var deletedPatient in deletedPatients)
            {
                var deletedPatientsTagEvents = _tagEventTasks.GetByPatientId(deletedPatient.Id);

                var deletedPatientsTagEventsCount = deletedPatientsTagEvents.Count;

                if (deletedPatientsTagEventsCount != tagEventTypes.Count)
                {
                    continue;
                }

                deletedPatientsTagEvents = deletedPatientsTagEvents.OrderBy(x => x.Created).ToList();

                for (int i = 0; i < deletedPatientsTagEventsCount - 1; i++)
                {

                    switch (i)
                    {
                        case 0:
                            {
                                casy1Udalosti.Add(deletedPatientsTagEvents[i + 1].Created
                                    .Subtract(deletedPatientsTagEvents[i].Created).TotalSeconds);
                                break;
                            }
                        case 1:
                            {
                                casy2Udalosti.Add(deletedPatientsTagEvents[i + 1].Created
                                    .Subtract(deletedPatientsTagEvents[i].Created).TotalSeconds);
                                break;
                            }
                        default: break;
                    }
                }
            }

            tagEventTypes = tagEventTypes.OrderBy(x => x.Id).ToList();

            //TODO remove hardcoded strings after db cleanup
            var obj = new
            {
                TagEventNameStart = "Doba vyšetření",
                TagEventNameEnd = "Čekání na transport",
                Times = casy1Udalosti
            };

            result.Add(obj);

            obj = new
            {
                TagEventNameStart = "Čekání na transport",
                TagEventNameEnd = "Odjezd z haly",
                Times = casy2Udalosti
            };
            result.Add(obj);

            return result;
        }

        [HttpGet]
        [ActionName("patients")]
        public List<PatientDto> GetSuitablePatients()
        {
            List<PatientDto> result = new List<PatientDto>();

            var tagEventTypes = _tagEventTypeTasks.GetAll();

            var deletedPatients = _patientTasks.GetAll(true, null);

            foreach (var deletedPatient in deletedPatients)
            {
                var deletedPatientsTagEvents = _tagEventTasks.GetByPatientId(deletedPatient.Id);

                var deletedPatientsTagEventsCount = deletedPatientsTagEvents.Count;

                if (deletedPatientsTagEventsCount != tagEventTypes.Count)
                {
                    continue;
                }

                result.Add(deletedPatient);
            }

            return result;
        }

        [HttpGet]
        [ActionName("patientsTime")]
        public object GetPatientsTime()
        {
            var patients = GetSuitablePatients();

            var groupedHours = patients.GroupBy(x => x.Created.ToLocalTime().Hour).Select(group => new
            {
                Hour = group.Key,
                Count = group.Count()
            }).ToList();

            var groupedDays = patients.GroupBy(x => x.Created.ToLocalTime().DayOfWeek).Select(group => new
            {
                Day = group.Key,
                Count = group.Count()
            }).ToList();

            var hours = Enumerable.Range(0, 24);


            List<object> temp = new List<object>();
            foreach (var day in System.Enum.GetValues(typeof(System.DayOfWeek)).Cast<System.DayOfWeek>())
            {
                var found = groupedDays.Find(x => x.Day == day);
                if (found != null)
                {
                    temp.Add(found);
                }
                else
                {
                    temp.Add(new { Day = day, Count = 0 });
                }
            }

            List<object> temp2 = new List<object>();
            foreach (var hour in hours)
            {
                var found = groupedHours.Find(x => x.Hour == hour);
                if (found != null)
                {
                    temp2.Add(found);
                }
                else
                {
                    temp2.Add(new { Hour = hour, Count = 0 });
                }
            }

            var result = new { days = temp, hours = temp2 };
            return result;
        }

        [ActionName("totalTimes")]
        public List<double> GetTotalTimes()
        {

            var result = new List<double>();

            var tagEventTypes = _tagEventTypeTasks.GetAll();

            var deletedPatients = _patientTasks.GetAll(true, null);

            foreach (var deletedPatient in deletedPatients)
            {
                var deletedPatientsTagEvents = _tagEventTasks.GetByPatientId(deletedPatient.Id);

                var deletedPatientsTagEventsCount = deletedPatientsTagEvents.Count;

                if (deletedPatientsTagEventsCount != tagEventTypes.Count)
                {
                    continue;
                }

                var sorted = deletedPatientsTagEvents.OrderBy(x => x.Created);

                var deducted = sorted.Last().Created - sorted.First().Created;

                result.Add(deducted.Seconds);
            }

            return result;
        }

        [HttpGet]
        [ActionName("timeline")]
        public List<object> GetTimeLine(int cardId)
        {
            List<object> result = new List<object>();

            List<double> casy1Udalosti = new List<double>();
            List<double> casy2Udalosti = new List<double>();
            //List<double> casy3Udalosti = new List<double>();

            var tagEventTypes = _tagEventTypeTasks.GetAll();

            var patient = _patientTasks.GetByCardId(cardId);

            var patientsTagEvents = _tagEventTasks.GetByPatientId(patient.Id);

            var patientsTagEventsCount = patientsTagEvents.Count;

            if (patientsTagEventsCount != tagEventTypes.Count)
            {
                return result;
            }

            patientsTagEvents = patientsTagEvents.OrderBy(x => x.TagEventType.Id).ToList();

            for (int i = 0; i < patientsTagEventsCount; i++)
            {
                switch (patientsTagEvents[i].TagEventType.Id)
                {
                    case 4:
                        {
                            casy1Udalosti.Add(patientsTagEvents.Where(x => x.TagEventType.Id == 7).First().Created
                                .Subtract(patientsTagEvents.Where(x => x.TagEventType.Id == 4).First().Created).TotalSeconds);
                            break;
                        }
                    case 7:
                        {
                            casy2Udalosti.Add(patientsTagEvents.Where(x => x.TagEventType.Id == 3).First().Created
                                .Subtract(patientsTagEvents.Where(x => x.TagEventType.Id == 7).First().Created).TotalSeconds);
                            break;
                        }
                    //case 3:
                    //    {
                    //        casy3Udalosti.Add(patientsTagEvents[i + 1].Created
                    //            .Subtract(patientsTagEvents[i].Created).TotalSeconds);
                    //        break;
                    //    }
                    default: break;
                }
            }


            tagEventTypes = tagEventTypes.OrderBy(x => x.Id).ToList();

            var obj = new { TagEventName = tagEventTypes[0].Note, Times = casy1Udalosti };
            result.Add(obj);

            obj = new { TagEventName = tagEventTypes[1].Note, Times = casy2Udalosti };
            result.Add(obj);

            //obj = new { TagEventName = tagEventTypes[2].Note, Times = casy3Udalosti };
            //result.Add(obj);

            return result;
        }

        [HttpGet]
        [ActionName("location")]
        public List<object> GetPatientLocationTimes(int cardId)
        {
            List<object> result = new List<object>();

            var patient = _patientTasks.GetByCardId(cardId);

            var patientsTagEvents = _tagEventTasks.GetByPatientId(patient.Id);
            var tagEventTypes = _tagEventTypeTasks.GetAll();
            if (patientsTagEvents.Count != tagEventTypes.Count)
            {
                return result;
            }

            patientsTagEvents = patientsTagEvents.OrderBy(x => x.Created).ToList();

            if (patientsTagEvents.Count == 0)
            {
                return result;
            }

            var tagLocations = _tagLocationTasks.GetTagLocationsByTagId(patientsTagEvents[0].Tag.Id)
                .OrderBy(x => x.Created).ToList();

            List<TagLocationDto> filteredTagLocations = new List<TagLocationDto>();

            bool firstOccurenceFound = false;
            for (int i = 0; i < tagLocations.Count; i++)
            {
                if (tagLocations[i].Created >= patientsTagEvents[0].Created && tagLocations[i].Created <=
                    patientsTagEvents[patientsTagEvents.Count - 1].Created)
                {
                    if (firstOccurenceFound == false)
                    {
                        if (i != 0)
                        {
                            filteredTagLocations.Add(tagLocations[i - 1]);
                        }
                    }

                    firstOccurenceFound = true;
                    filteredTagLocations.Add(tagLocations[i]);

                    if (tagLocations[i + 1].Created > patientsTagEvents[patientsTagEvents.Count - 1].Created)
                    {
                        filteredTagLocations.Add(tagLocations[i + 1]);
                        break;
                    }
                }
            }

            for (int i = 0; i < filteredTagLocations.Count - 1; i++)
            {
                List<double> list = new List<double>();
                list.Add(filteredTagLocations[i + 1].Created.Subtract(filteredTagLocations[i].Created).TotalSeconds);
                var obj = new { RoomName = filteredTagLocations[i].Room.Name, Times = list };
                result.Add(obj);
            }

            return result;
        }


    }
}