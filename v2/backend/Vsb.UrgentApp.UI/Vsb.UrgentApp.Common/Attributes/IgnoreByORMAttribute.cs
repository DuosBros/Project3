using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Common.Attributes
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class IgnoreByORMAttribute : Attribute
    {
    }
}
