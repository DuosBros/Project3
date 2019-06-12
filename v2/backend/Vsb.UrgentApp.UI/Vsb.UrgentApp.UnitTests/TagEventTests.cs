using Microsoft.Practices.ServiceLocation;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vsb.UrgentApp.Tasks.Patient;
using Vsb.UrgentApp.Tasks.Tag;
using Vsb.UrgentApp.Tasks.TagEvent;
using Vsb.UrgentApp.Tests.Common;

namespace Vsb.UrgentApp.UnitTests
{
	public class TagEventTests : IntegrationTestsBase
	{
		private ITagEventTask eventTasks;

		[SetUp]		
		public void Init()
		{
			eventTasks = ServiceLocator.Current.GetInstance<ITagEventTask>();
		}

		//[Test]
		//public void GetAllTagEvents_void_success()
		//{
		//	var tagEvents = eventTasks.GetAll();

		//	Assert.IsNotNull(tagEvents);
		//	Assert.IsTrue(tagEvents.Count > 0);
		//}

		//[Test]
		//public void CreateTagEvent_TagEventDto_success()
		//{
		//	TagEventDto tagEvents = new TagEventDto
		//	{
		//		Tag_Id = 7,
		//		TagEventType_Id = 4,
		//		Patient_Id = 7,
		//		Created = DateTime.Now
		//	};

		//	var result = eventTasks.Create(tagEvents);

		//	Assert.IsNotNull(result);
		//}
	}
}
