using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Common.Mappers;

namespace Vsb.UrgentApp.Tasks.Patient.Mappers
{
	public interface IPatientDtoMapper : IMapper<Domain.DomainObjects.Entities.Patient, PatientDto>, IMapper<PatientDto, Domain.DomainObjects.Entities.Patient>
	{
	}
}
