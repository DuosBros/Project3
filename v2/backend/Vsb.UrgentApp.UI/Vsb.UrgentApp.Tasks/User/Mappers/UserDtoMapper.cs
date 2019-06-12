using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace Vsb.UrgentApp.Tasks.User.Mappers
{
    public class UserDtoMapper : IUserDtoMapper
    {
        private static readonly object Sync = new object();
        private static bool _initialized;

        public UserDto MapFrom(Domain.DomainObjects.Entities.User input)
        {
            if (!_initialized)
            {
                lock (Sync)
                {
                    if (!_initialized)
                    {
                        CreateMap();

                        _initialized = true;
                    }
                }
            }

            if (input == null)
            {
                return null;
            }

            return (UserDto)Mapper.Map(input, input.GetType(), typeof(UserDto));
        }

        public Domain.DomainObjects.Entities.User MapFrom(UserDto input)
        {
            if (!_initialized)
            {
                lock (Sync)
                {
                    if (!_initialized)
                    {
                        CreateMap();

                        _initialized = true;
                    }
                }
            }

            if (input == null)
            {
                return null;
            }

            return (Domain.DomainObjects.Entities.User)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.User));
        }

        private void CreateMap()
        {
            // From
            Mapper.CreateMap<Domain.DomainObjects.Entities.User, UserDto>();

            // To
            Mapper.CreateMap<UserDto, Domain.DomainObjects.Entities.User>()
                .ForMember(x => x.LastAccess, opt => opt.Ignore());
        }
    }
}
