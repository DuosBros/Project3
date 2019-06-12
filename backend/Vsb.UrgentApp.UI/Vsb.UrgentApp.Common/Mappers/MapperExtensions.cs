using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;

namespace Vsb.UrgentApp.Common.Mappers
{
	public static class MapperExtensions
	{
		public static IEnumerable<TDestination> MapAllUsing<TSource, TDestination>(this IEnumerable<TSource> items, IMapper<TSource, TDestination> mapper)
		{
			return items.Select(mapper.MapFrom);
		}

		public static IList<TDestination> MapAllUsing<TSource, TDestination>(this IList<TSource> items, IMapper<TSource, TDestination> mapper)
		{
			return items.Select(mapper.MapFrom).ToList();
		}

		public static TDestination MapUsing<TSource, TDestination>(this TSource source, IMapper<TSource, TDestination> mapper)
		{
			return mapper.MapFrom(source);
		}

		public static IMappingExpression<TSource, TDestination> IgnoreAllNonExisting<TSource, TDestination>(this IMappingExpression<TSource, TDestination> expression)
		{
			var sourceType = typeof(TSource);
			var destinationType = typeof(TDestination);
			var existingMaps = AutoMapper.Mapper.GetAllTypeMaps().First(x => x.SourceType == sourceType && x.DestinationType == destinationType);

			foreach (var property in existingMaps.GetUnmappedPropertyNames())
			{
				expression.ForMember(property, opt => opt.Ignore());
			}

			return expression;
		}
	}
}
