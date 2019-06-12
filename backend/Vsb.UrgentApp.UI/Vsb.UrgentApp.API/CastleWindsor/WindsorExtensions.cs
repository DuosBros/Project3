using System;
using System.Collections.Generic;
using System.Linq;
using Castle.MicroKernel.Registration;

namespace Vsb.UrgentApp.API.CastleWindsor
{
	/// <summary>
	/// Class for Castle Windsor registartion extentions.
	/// </summary>
	public static class WindsorExtension
	{
		/// <summary>
		/// Types the implementing interfaces in.
		/// </summary>
		/// <param name="descriptor">The descriptor.</param>
		/// <param name="interfaceNamespace">The interface namespace.</param>
		/// <returns></returns>
		public static BasedOnDescriptor TypesImplementingInterfacesIn(this FromAssemblyDescriptor descriptor, string interfaceNamespace)
		{
			return descriptor.Where(delegate(Type type)
			{
				IEnumerable<Type> interfaces =
					from t in type.GetInterfaces()
					where t.Namespace != null && t.Namespace.StartsWith(interfaceNamespace)
					select t;

				return interfaces.Any();
			});
		}

		/// <summary>
		/// Uses the first interface of a type. This method has non-deterministic behavior when type implements more than one interface!
		/// </summary>
		/// <returns></returns>
		public static BasedOnDescriptor FirstNonGenericInterface(this ServiceDescriptor descriptor)
		{
			return descriptor.Select((type, @base) =>
			{
				var first = type.GetInterfaces().FirstOrDefault(t => !t.IsGenericType);
				if (first == null)
				{
					return null;
				}

				return new[] { first };
			});
		}
	}
}
