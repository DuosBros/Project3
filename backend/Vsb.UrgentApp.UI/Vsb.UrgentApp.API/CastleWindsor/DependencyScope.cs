using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Dependencies;
using Castle.MicroKernel;
using Castle.MicroKernel.Lifestyle;

namespace Vsb.UrgentApp.API.CastleWindsor
{
	/// <summary>
	/// Class to define dependency scope.
	/// </summary>
	public sealed class DependencyScope : IDependencyScope
	{
		private readonly IKernel kernel;

		private readonly IDisposable disposable;

		/// <summary>
		/// Initializes a new instance of the <see cref="DependencyScope"/> class.
		/// </summary>
		/// <param name="kernel">The kernel.</param>
		public DependencyScope(IKernel kernel)
		{
			this.kernel = kernel;
			disposable = kernel.BeginScope();
		}

		/// <summary>
		/// Gets the service.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <returns></returns>
		public object GetService(Type type)
		{
			return kernel.HasComponent(type) ? kernel.Resolve(type) : null;
		}

		/// <summary>
		/// Gets the services.
		/// </summary>
		/// <param name="type">The type.</param>
		/// <returns></returns>
		public IEnumerable<object> GetServices(Type type)
		{
			return kernel.ResolveAll(type).Cast<object>();
		}

		/// <summary>
		/// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
		/// </summary>
		public void Dispose()
		{
			disposable.Dispose();
		}
	}
}