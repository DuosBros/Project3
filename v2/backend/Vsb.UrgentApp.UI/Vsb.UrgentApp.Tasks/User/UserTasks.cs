using System;
using System.Linq;
using NHibernate;
using NHibernate.Linq;
using NLog;
using SharpArch.NHibernate;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Domain.Specifications;
using Vsb.UrgentApp.Tasks.User.Mappers;

namespace Vsb.UrgentApp.Tasks.User
{
    public class UserTasks : IUserTasks
    {
        private static readonly Logger _log = LogManager.GetCurrentClassLogger();

        private readonly IUserRepository _userRepository;
        private readonly IUserDtoMapper _userDtoMapper;

        public UserTasks(
            IUserRepository userRepository, 
            IUserDtoMapper userDtoMapper)
        {
            this._userRepository = Requires.IsNotNull(userRepository, nameof(userRepository));
            this._userDtoMapper = Requires.IsNotNull(userDtoMapper, nameof(userDtoMapper));
        }

        public UserDto Authenticate(UserDto userDto)
        {
            Domain.DomainObjects.Entities.User user = GetUserAndUpdateLastAccess(userDto);

            if (user == null)
            {
                return null;
            }

            return _userDtoMapper.MapFrom(user);
        }
   
        private Domain.DomainObjects.Entities.User GetUserAndUpdateLastAccess(UserDto userDto)
        {
            Domain.DomainObjects.Entities.User user = _userRepository.FindAll(new UserByNameAndPasswordSpecification(userDto.Name, userDto.Password))
                .Cacheable()
                .CacheRegion("LongTerm")
                .FirstOrDefault();

            if (user == null)
            {
                throw new NullReferenceException(string.Format("Username: {0} is not valid.", userDto.Name));
            }

            UpdateLastAccess(user);

            return user;
        }

        private void UpdateLastAccess(Domain.DomainObjects.Entities.User user)
        {
            user.LastAccess = DateTime.UtcNow;

            using (ITransaction t = NHibernateSession.Current.BeginTransaction())
            {
                _userRepository.SaveOrUpdate(user);

                t.Commit();
            }
        }
    }
}
