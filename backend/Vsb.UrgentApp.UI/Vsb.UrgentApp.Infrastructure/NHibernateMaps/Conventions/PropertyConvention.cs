namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions
{
    using FluentNHibernate.Conventions;
    using FluentNHibernate.Conventions.Instances;

    public class PropertyConvention : IPropertyConvention
	{
		public void Apply(IPropertyInstance instance)
		{
			//instance.Column("[" + instance.Name + "]");
			instance.Column(instance.Name);
		}
	}
}
