using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Domain.Infrastructure.Repositories;
using Vsb.UrgentApp.Tasks.TagEvent;
using Vsb.UrgentApp.Tasks.User;

namespace Vsb.UrgentApp.Tasks.User
{
    public class UserTasks : IIUserTasks
    {
        private readonly IUserRepository userRepository;
        private readonly IBaseMapper baseMapper;

        public UserTasks(IUserRepository userRepository,
            IBaseMapper baseMapper)
        {
            this.userRepository = Requires.IsNotNull(userRepository, nameof(userRepository));
            this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
        }

        public UserDto GetAuthenticatedUser()
        {
            UserDto user = new UserDto();
            HttpContext httpContext = HttpContext.Current;
            string authHeader = httpContext.Request.Headers["Authorization"];

            if (authHeader != null && authHeader.StartsWith("Basic"))
            {
                string encodedUsernamePassword = authHeader.Substring("Basic ".Length).Trim();

                Encoding encoding = Encoding.GetEncoding("iso-8859-1");
                string usernamePassword = encoding.GetString(Convert.FromBase64String(encodedUsernamePassword));

                int seperatorIndex = usernamePassword.IndexOf(':');

                user.Name = usernamePassword.Substring(0, seperatorIndex);
                user.Password = usernamePassword.Substring(seperatorIndex + 1);

                if (ValidateUserIdentity(user))
                {
                    return user;
                }

	            throw new UnauthorizedAccessException("Name or password is incorrect.");
			}

	        throw new UnauthorizedAccessException("The authorization header is either empty or isn't Basic.");
        }

        private bool ValidateUserIdentity(UserDto user)
        {
            UserDto foundUser = baseMapper.BindData<UserDto>(
                userRepository.AuthenticateUser(user.Name, user.Password).User);

            var result = foundUser != null ? true : false;

            return result;
        }
    }
}
