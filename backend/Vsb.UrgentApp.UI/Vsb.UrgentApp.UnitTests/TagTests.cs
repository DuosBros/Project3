using System;
using NUnit.Framework;
using Vsb.UrgentApp.Tasks.Tag;
using Microsoft.Practices.ServiceLocation;
using Vsb.UrgentApp.Tests.Common;

namespace Vsb.UrgentApp.UnitTests
{
	public class TagTests : IntegrationTestsBase
	{
		private ITagTasks tagTasks;

		[SetUp]
		public void Init()
		{
			tagTasks = ServiceLocator.Current.GetInstance<ITagTasks>();

			Infrastructure.Db.FireBirdConnection.InitializeFirebird();
		}

		[Test]
		public void GetTagById_TagId_success()
		{
			var tags = tagTasks.GetAll();

			Assert.IsNotNull(tags);
			Assert.IsTrue(tags.Count > 0);

			Random rnd = new Random();
			var index = rnd.Next(0, tags.Count - 1);

			var result = tagTasks.GetById(tags[index].Id);

			Assert.IsNotNull(result);
		}

		[Test]
		public void GetAllTags_void_success()
		{
			var result = tagTasks.GetAll();

			Assert.IsNotNull(result);
			Assert.IsTrue(result.Count > 0);
		}
	}
}
