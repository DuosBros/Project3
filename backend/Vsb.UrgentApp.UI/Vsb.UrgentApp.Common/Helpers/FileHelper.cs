using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Vsb.UrgentApp.Common.Helpers
{
    public class FileHelper
    {
        public static void SetUpJsonSerializerSettings(JsonSerializerSettings settings)
        {
			settings.Converters.Add(new Newtonsoft.Json.Converters.IsoDateTimeConverter());
			settings.Converters.Add(new Newtonsoft.Json.Converters.StringEnumConverter() { CamelCaseText = true });
			settings.Formatting = Formatting.Indented;
			settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
			settings.TypeNameHandling = TypeNameHandling.Objects;

			// Metadata setting to allow e.g. $type in any order (not only the first field which is the default)
			settings.MetadataPropertyHandling = MetadataPropertyHandling.ReadAhead;
		}
    }
}