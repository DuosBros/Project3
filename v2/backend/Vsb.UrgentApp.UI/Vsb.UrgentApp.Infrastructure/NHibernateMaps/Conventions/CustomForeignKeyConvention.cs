namespace Vsb.UrgentApp.Infrastructure.NHibernateMaps.Conventions
{
    using System;
    using FluentNHibernate;
    using FluentNHibernate.Conventions;

    public class CustomForeignKeyConvention : ForeignKeyConvention 
    {
        protected override string GetKeyName(Member property, Type type)
        {
            if (property == null)
            {
                return type.Name + "_ID";
            }

            return property.Name + "_ID";  
        }
    }
}