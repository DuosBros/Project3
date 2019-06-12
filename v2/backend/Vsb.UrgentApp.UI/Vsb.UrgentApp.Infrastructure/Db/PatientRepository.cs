
using System;
using System.Collections.Generic;
using System.Linq;
using NHibernate.Mapping;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;

namespace Vsb.UrgentApp.Infrastructure.Db
{
	public class PatientRepository : LinqRepository<Patient>, IPatientRepository
	{
	    public List<Patient> GetDeletedPatients()
	    {
	        string sql = $"select PAT from {typeof(Patient).Name} PAT" + 
                         " where PAT.Deleted is not null" +
                         " order by PAT.Id";

            var result = this.Session.CreateQuery(sql).SetCacheable(true).SetCacheRegion("LongTerm")
	            .List<Patient>().OrderByDescending(x => x.Deleted).ToList();

            return result;
        }
        
	    public List<Patient> GetActivePatients()
	    {
	        string sql = $"select PAT from {typeof(Patient).Name} PAT" +
	                     " where PAT.Deleted is null" +
	                     " order by PAT.Id";

	        var result = this.Session.CreateQuery(sql).SetCacheable(true).SetCacheRegion("LongTerm")
	            .List<Patient>().OrderByDescending(x => x.Created).ToList();

	        return result;
        }
	}
}
