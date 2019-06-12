using FluentNHibernate.Automapping;
using FluentNHibernate.Automapping.Alterations;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.FluentOverrides
{
	public class PatientOverride : IAutoMappingOverride<Patient>
	{
		public void Override(AutoMapping<Patient> mapping)
		{
			mapping.Cache.ReadOnly().Region("LongTermReadWrite");
			mapping.Id(x => x.Id).GeneratedBy.Sequence("GEN_PATIENT_ID");
			mapping.HasOne(patient => patient.Tag).Not.LazyLoad().Cascade.All();
		}
	}
}
