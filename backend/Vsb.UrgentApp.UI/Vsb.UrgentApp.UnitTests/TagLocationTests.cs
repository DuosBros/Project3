using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.ServiceLocation;
using NUnit.Framework;
using Vsb.UrgentApp.Tasks.TagEvent;
using Vsb.UrgentApp.Tasks.TagLocation;
using Vsb.UrgentApp.Tests.Common;

namespace Vsb.UrgentApp.UnitTests
{
	public class TagLocationTests : IntegrationTestsBase
	{
		private ITagLocationTasks tagLocationTasks;

		[SetUp]
		public void Init()
		{
			tagLocationTasks = ServiceLocator.Current.GetInstance<ITagLocationTasks>();

			Infrastructure.Db.FireBirdConnection.InitializeFirebird();
		}

		[Test]
		public void GetAllTagLocations_void_success()
		{
			var locations = tagLocationTasks.GetAll();

			Assert.IsNotNull(locations);
			Assert.IsTrue(locations.Count > 0);
		}
	}
}
