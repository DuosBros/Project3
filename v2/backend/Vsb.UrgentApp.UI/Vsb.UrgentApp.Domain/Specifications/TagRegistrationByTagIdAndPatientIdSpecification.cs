using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using SharpArch.Domain.Specifications;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Domain.Specifications
{
    public class TagRegistrationByTagIdAndPatientIdSpecification : QuerySpecification<TagRegistration>
    {
        private readonly int? _patientId;
        private readonly int? _tagId;

        public TagRegistrationByTagIdAndPatientIdSpecification(int? patientId, int? tagId)
        {
            if (patientId.HasValue)
            {
                this._patientId = patientId.Value;
            }
            else
            {
                this._patientId = null;
            }

            if (tagId.HasValue)
            {
                this._tagId = tagId.Value;
            }
            else
            {
                this._tagId = null;
            }
        }

        public override Expression<Func<TagRegistration, bool>> MatchingCriteria
        {
            get
            {
                if (_patientId == null)
                {
                    return tagRegistration => tagRegistration.Tag.Id == _tagId;
                }
                else if (_tagId == null)
                {
                    return tagRegistration => tagRegistration.Patient.Id == _patientId;
                }
                else
                {
                    return tagRegistration => tagRegistration.Patient.Id == _patientId && tagRegistration.Tag.Id == _tagId;
                }
            }
        }
    }
}
