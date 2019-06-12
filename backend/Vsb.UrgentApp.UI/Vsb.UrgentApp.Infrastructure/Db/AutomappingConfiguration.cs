using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentNHibernate;
using FluentNHibernate.Automapping;
using SharpArch.Domain.DomainModel;
using Entity = FluentNHibernate.Data.Entity;

namespace Vsb.UrgentApp.Infrastructure.Db
{
	public class AutomappingConfiguration : DefaultAutomappingConfiguration
	{
		/// <summary>
		/// Choose types that are mapped. Here only generic types of IEntityWithTypedId&lt;&gt; are mapped.
		/// </summary>
		/// <param name="type">Type as candidate for mapping.</param>
		/// <returns>True if it should be mapped, otherwise false.</returns>
		public override bool ShouldMap(Type type)
		{
			return type.GetInterfaces().Any(
				x => (x.IsGenericType
				      && x.GetGenericTypeDefinition() == typeof(IEntityWithTypedId<>)));
			//  && type.GetCustomAttributes(typeof(IgnoreByORMAttribute), true).Length == 0);
		}

		/// <summary>
		/// Choose properties of type which toUtc map. Here only public writable property is mapped.
		/// Detail: base.ShouldMap(member) { return member.IsProperty && member.IsPublic; }
		/// </summary>
		/// <param name="member">Class member as a candidate for mapping.</param>
		/// <returns>True if it should be mapped, otherwise false.</returns>
		public override bool ShouldMap(Member member)
		{
			return base.ShouldMap(member) && member.CanWrite;
		}

		/// <summary>
		/// Abstract classes that are considered as layer super types. It means that are unmapped.
		/// Here we don't map abstract classes EntityWithTypedId&lt;&gt; or Entity.
		/// </summary>
		/// <param name="type">Type as candidate for mapping.</param>
		/// <returns>True if it should be unmapped, otherwise false.</returns>
		public override bool AbstractClassIsLayerSupertype(Type type)
		{
			return type == typeof(EntityWithTypedId<>) || type == typeof(Entity);
		}

		/// <summary>
		/// Entity id is member called 'Id'.
		/// </summary>
		/// <param name="member">Class member as a candidate for mapping.</param>
		/// <returns>True if member represents id, otherwise false.</returns>
		public override bool IsId(Member member)
		{
			return member.Name == "Id";
		}
	}
}
