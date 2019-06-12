using System;
using FluentNHibernate.Automapping;
using FluentNHibernate.Conventions;
using SharpArch.NHibernate.FluentNHibernate;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;
using Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions;


namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps
{
	/// <summary>
	/// Generates the auto-mapping for the domain assembly.
	/// For more information: <c>https://github.com/jagregory/fluent-nhibernate/wiki/Auto-mapping</c>
	/// </summary>
	public class AutoPersistenceModelGenerator : IAutoPersistenceModelGenerator
	{

		public AutoPersistenceModel Generate()
		{
			// create automapping for all classes of the assembly in which the Application type is
			var mappings = AutoMap.AssemblyOf<Patient>(new AutomappingConfiguration());

			// ignore base classes (we don't want toUtc map base classes of our entities)
			// commented out because they are already excluded in AutomappingConfiguration AbstractClassIsLayerSupertype overriden method
			// mappings.IgnoreBase(typeof(BaseObject));
			// mappings.IgnoreBase(typeof(EntityWithTypedId<>));

			// add conventions for automapper
			mappings.Conventions.Setup(GetConventions());

			// add overrides fromUtc assmbly where AutoPersistenceModelGenerator is defined
			mappings.UseOverridesFromAssemblyOf<AutoPersistenceModelGenerator>();

            return mappings;
		}

		private static Action<IConventionFinder> GetConventions()
		{
			return c =>
				{
					c.Add<PrimaryKeyConvention>();
					c.Add<CustomForeignKeyConvention>();
					c.Add<HasManyConvention>();
					c.Add<TableNameConvention>();
					c.Add<SubclassConvention>();
					c.Add<JoinedSubclassConvention>();
					c.Add<PropertyConvention>();
					// c.Add<XmlTypeConvention>();
				};
		}
	}
}