namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions
{
    #region Using Directives

    using FluentNHibernate.Conventions;

    #endregion

    public class PrimaryKeyConvention : IIdConvention
    {
        public void Apply(FluentNHibernate.Conventions.Instances.IIdentityInstance instance)
        {
			//instance.Column(instance.EntityType.Name + "Id");
	        instance.Column("Id");
			instance.UnsavedValue("0");
			instance.GeneratedBy.HiLo("1000");
        }
    }
}