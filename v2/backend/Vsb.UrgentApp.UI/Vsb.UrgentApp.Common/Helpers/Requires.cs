using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Common.Helpers
{
	public static class Requires
	{
		public static T IsNotNull<T>(T instance, string paramName) where T : class
		{
			// Use ReferenceEquals in case T overrides equals.
			if (object.ReferenceEquals(null, instance))
			{
				// Call a method that throws instead of throwing directly. This allows
				// this IsNotNull method to be inlined.
				ThrowArgumentNullException(paramName);
			}

			return instance;
		}

		private static void ThrowArgumentNullException(string paramName)
		{
			throw new ArgumentNullException(paramName);
		}
	}
}
