﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.PersistenceSupport;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Domain.Infrastructure.Repositories
{
	public interface ITagRegistrationRepository : ILinqRepository<TagRegistration>, IRepository<TagRegistration>
	{
	    void DeleteTagRegistration(int id);
	}
}
