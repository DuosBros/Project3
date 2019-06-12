using FluentNHibernate.Conventions;
using FluentNHibernate.Conventions.Instances;

namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions
{
	public class SubclassConvention : ISubclassConvention
	{
		public void Apply(ISubclassInstance instance)
		{
			// if (instance.Name == typeof(Person).AssemblyQualifiedName) instance.DiscriminatorValue('p');
			// if (instance.Name == typeof(Group).AssemblyQualifiedName) instance.DiscriminatorValue('g');
		}
	}
}
