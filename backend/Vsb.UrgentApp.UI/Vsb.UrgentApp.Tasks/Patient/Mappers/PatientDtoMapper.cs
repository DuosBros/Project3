using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Tasks.Tag.Mappers;

namespace Vsb.UrgentApp.Tasks.Patient.Mappers
{
	public class PatientDtoMapper : IPatientDtoMapper
	{
		private static readonly object Sync = new object();
		private static bool initialized;
		private readonly ITagDtoMapper tagDtoMapper;
		

		public PatientDtoMapper(
			ITagDtoMapper tagDtoMapper)
		{
			this.tagDtoMapper = Requires.IsNotNull(tagDtoMapper, nameof(tagDtoMapper));
			
		}

		public PatientDto MapFrom(Domain.DomainObjects.Entities.Patient input)
		{
			if (!initialized)
			{
				lock (Sync)
				{
					if (!initialized)
					{
						CreateMap();

						initialized = true;
					}
				}
			}

			if (input == null)
			{
				throw new NullReferenceException("Patient is not set!");
			}

			var result = (PatientDto)Mapper.Map(input, input.GetType(), typeof(PatientDto));

			return result;
		}

		public Domain.DomainObjects.Entities.Patient MapFrom(PatientDto input)
		{
			if (!initialized)
			{
				lock (Sync)
				{
					if (!initialized)
					{
						CreateMap();

						initialized = true;
					}
				}
			}

			if (input == null)
			{
				throw new NullReferenceException("PatientDto is not set!");
			}

			var result = (Domain.DomainObjects.Entities.Patient)Mapper.Map(input, input.GetType(), typeof(Domain.DomainObjects.Entities.Patient));

			return result;
		}

		private void CreateMap()
		{
			// From
			Mapper.CreateMap<Domain.DomainObjects.Entities.Patient, PatientDto>()
				.ForMember(x => x.Deleted,
					opt => opt.MapFrom(input =>
						input.Deleted.HasValue ? new DateTime(input.Deleted.Value.Ticks, DateTimeKind.Utc) : (DateTime?) null))
				.ForMember(x => x.Tag, opt => opt.MapFrom(input => input != null ? tagDtoMapper.MapFrom(input.Tag) : null));

			// To
			Mapper.CreateMap<PatientDto, Domain.DomainObjects.Entities.Patient>()
				.ForMember(x => x.BirthDate, opt => opt.MapFrom(input => string.IsNullOrEmpty(input.BirthDate) ? null : input.BirthDate))
			.ForMember(x => x.Tag, opt => opt.Ignore());
		}
	}

}
