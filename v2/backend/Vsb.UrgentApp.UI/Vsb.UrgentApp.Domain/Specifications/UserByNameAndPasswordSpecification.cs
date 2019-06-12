using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.Specifications;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Domain.Specifications
{
    public class UserByNameAndPasswordSpecification : QuerySpecification<User>
    {
        private readonly string _name;
        private readonly string _password;

        public UserByNameAndPasswordSpecification(string name, string password)
        {
            this._name = name;
            this._password = password;
        }

        public override Expression<Func<User, bool>> MatchingCriteria
        {
            get
            {
                return user => user.Name == this._name
                               && user.Password == this._password;
            }
        }
    }
}
