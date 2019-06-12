using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using NLog;
using Vsb.UrgentApp.Common.Mappers;

namespace Vsb.UrgentApp.Common.Mappers
{
    public class BaseMapper : IBaseMapper
    {
		public T BindData<T>(DataTable dt)
		{
			// Create object
			var ob = Activator.CreateInstance<T>();

			if (dt.Rows.Count == 0)
			{
				return default(T);
			}

			DataRow dr = dt.Rows[0];

			List<string> columns = GetColumns(dt);

			// Get all fields
			var fields = typeof(T).GetFields();
			foreach (var fieldInfo in fields)
			{
				if (columns.Contains(fieldInfo.Name))
				{
					// Fill the data into the field
					fieldInfo.SetValue(ob, dr[fieldInfo.Name]);
				}
			}

			// Get all properties
			var properties = typeof(T).GetProperties();

			FillProperties(columns, properties, dr, ob);

			return ob;
		}

		public List<T> BindDataList<T>(DataTable dt)
		{
			List<string> columns = GetColumns(dt);

			var fields = typeof(T).GetFields();
			var properties = typeof(T).GetProperties();

			List<T> lst = new List<T>();	

			foreach (DataRow dr in dt.Rows)
			{			
				var ob = Activator.CreateInstance<T>();

				foreach (var fieldInfo in fields)
				{
					if (columns.Contains(fieldInfo.Name))
					{
						fieldInfo.SetValue(ob, dr[fieldInfo.Name]);
					}
				}	

				FillProperties(columns, properties, dr, ob);

				lst.Add(ob);
			}

			return lst;
		}

		private static List<string> GetColumns(DataTable dt)
		{
			List<string> columns = new List<string>();
			foreach (DataColumn dc in dt.Columns)
			{
				columns.Add(dc.ColumnName);
			}

			return columns;
		}

		private static void FillProperties<T>(List<string> columns, System.Reflection.PropertyInfo[] properties, DataRow dr, T ob)
		{
			foreach (var propertyInfo in properties)
			{
				if (columns.Any(p => p.Equals(propertyInfo.Name, StringComparison.OrdinalIgnoreCase)))
				{
					if (dr[propertyInfo.Name] != null)
					{
						if (propertyInfo.PropertyType == typeof(string))
						{
							if (string.IsNullOrEmpty(dr[propertyInfo.Name].ToString()))
							{
								propertyInfo.SetValue(ob, string.Empty);
							}
							else
							{
								propertyInfo.SetValue(ob, dr[propertyInfo.Name].ToString());
							}
						}
						else if (propertyInfo.PropertyType == typeof(DateTime) || dr[propertyInfo.Name] is DateTime)
						{
							if (string.IsNullOrEmpty(dr[propertyInfo.Name].ToString()))
							{
								propertyInfo.SetValue(ob, null);
							}
							else
							{
								DateTime dateTime = new DateTime();
								dateTime = (DateTime)dr[propertyInfo.Name];
								//DateTime.TryParseExact(
								//	dr[propertyInfo.Name].ToString(), 
								//	"d.M.yyyy H:mm:ss", 
								//	CultureInfo.InvariantCulture, 
								//	DateTimeStyles.None, 
								//	out dateTime);

								var dateTimeUTC = new DateTime(dateTime.Ticks, DateTimeKind.Utc);
								propertyInfo.SetValue(ob, dateTimeUTC);
							}
						}
						else if (dr[propertyInfo.Name] is DBNull)
						{
							propertyInfo.SetValue(ob, null);
						}
						else
						{
							propertyInfo.SetValue(ob, dr[propertyInfo.Name]);
						}
					}
					else
					{
						propertyInfo.SetValue(ob, null);
					}
				}
			}
		}
	}
}
