namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions
{
	#region Using Directives

	using FluentNHibernate.Conventions;

	#endregion

	public class TableNameConvention : IClassConvention
	{
		public void Apply(FluentNHibernate.Conventions.Instances.IClassInstance instance)
		{
			instance.Table("\"" + instance.EntityType.Name.ToUpper() + "\"");
			//instance.Table("[" + instance.EntityType.Name + "]");

			// instance.Table("[" + instance.EntityType.Name.InflectTo().Pluralized + "]");
		}
	}
}