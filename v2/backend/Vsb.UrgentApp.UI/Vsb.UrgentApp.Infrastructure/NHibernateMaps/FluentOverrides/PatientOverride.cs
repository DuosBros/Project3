using FluentNHibernate.Automapping;
using FluentNHibernate.Automapping.Alterations;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.FluentOverrides
{
	public class PatientOverride : IAutoMappingOverride<Patient>
	{
		public void Override(AutoMapping<Patient> mapping)
		{
			mapping.Cache.ReadWrite().Region("LongTermReadWrite");
			mapping.Id(x => x.Id).GeneratedBy.Sequence("GEN_PATIENT_ID");
		    mapping.HasOne(pat => pat.TagRegistration).PropertyRef(x => x.Patient).Not.LazyLoad().Cascade.All();

		    mapping.HasMany(x => x.TagEvents)
		        .Cascade.Delete()
		        .KeyColumn("ID");
        }
	}
}
