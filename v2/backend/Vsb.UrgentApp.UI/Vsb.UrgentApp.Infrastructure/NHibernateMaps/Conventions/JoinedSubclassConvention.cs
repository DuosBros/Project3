using FluentNHibernate.Conventions;
using FluentNHibernate.Conventions.Instances;

namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions
{
	public class JoinedSubclassConvention : IJoinedSubclassConvention
	{
		public void Apply(IJoinedSubclassInstance instance)
		{
			instance.Table("[" + instance.EntityType.Name + "]");
		}
	}
}
