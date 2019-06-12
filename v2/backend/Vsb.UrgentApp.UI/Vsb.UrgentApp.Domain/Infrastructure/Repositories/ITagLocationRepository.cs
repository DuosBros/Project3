using SharpArch.Domain.PersistenceSupport;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Domain.Infrastructure.Repositories
{
    public interface ITagLocationRepository : ILinqRepository<TagLocation>, IRepository<TagLocation>
    {
    }
}
