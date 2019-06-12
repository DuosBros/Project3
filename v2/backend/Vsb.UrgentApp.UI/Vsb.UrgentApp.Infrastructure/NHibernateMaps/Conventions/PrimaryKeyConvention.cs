namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions
{
    #region Using Directives

    using FluentNHibernate.Conventions;

    #endregion

    public class PrimaryKeyConvention : IIdConvention
    {
        public void Apply(FluentNHibernate.Conventions.Instances.IIdentityInstance instance)
        {
            //instance.Column(instance.EntityType.Name + "_ID");
            instance.Column("ID");
			instance.UnsavedValue("0");
			instance.GeneratedBy.HiLo("1000");
        }
    }
}