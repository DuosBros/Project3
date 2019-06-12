using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.DomainModel;

namespace Vsb.UrgentApp.Domain.DomainObjects.Entities
{
    public class Room : Entity
    {
       public virtual string Name { get; set; }

        public virtual string Note { get; set; }
        
    }
}
