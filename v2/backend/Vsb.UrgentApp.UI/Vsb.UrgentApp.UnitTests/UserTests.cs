using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.ServiceLocation;
using NUnit.Framework;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.User;
using Vsb.UrgentApp.Tests.Common;

namespace Vsb.UrgentApp.UnitTests
{
    public class UserTests : IntegrationTestsBase
    {
        private IUserTasks _userTasks;

        [SetUp]
        public void Init()
        {
            _userTasks = ServiceLocator.Current.GetInstance<IUserTasks>();
        }

        [Test]
        public void Authenticate_UserDto_success()
        {
            UserDto userDto = new UserDto
            {
                Name = "sa",
                Password = "Test!234"
            };

            var result = _userTasks.Authenticate(userDto);

            Assert.NotNull(result);
        }
    }
}
