using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;

namespace Vsb.UrgentApp.Infrastructure.Db
{
	public class TagRegistrationRepository : LinqRepository<TagRegistration>, ITagRegistrationRepository
	{
	    public void DeleteTagRegistration(int id)
	    {
	        string sql1 = "delete from TagRegistration TR" +
	                      " where TR.Id = :TagRegistrationId";

	        this.Session.CreateQuery(sql1).SetParameter("TagRegistrationId", id)
	            .ExecuteUpdate();
	    }
    }
}
