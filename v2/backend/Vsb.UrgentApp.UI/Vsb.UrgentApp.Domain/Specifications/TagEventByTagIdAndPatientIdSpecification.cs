using System;
using System.Linq.Expressions;
using SharpArch.Domain.Specifications;
using Vsb.UrgentApp.Domain.DomainObjects.Entities;

namespace Vsb.UrgentApp.Domain.Specifications
{
    public class TagEventByTagIdAndPatientIdSpecification : QuerySpecification<TagEvent>
    {
        private readonly int? _patientId;
        private readonly int? _tagId;

        public TagEventByTagIdAndPatientIdSpecification(int? patientId, int? tagId)
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

        public override Expression<Func<TagEvent, bool>> MatchingCriteria
        {
            get
            {
                if (_patientId == null)
                {
                    return tagEvent => tagEvent.Tag.Id == _tagId;
                }
                else if (_tagId == null)
                {
                    return tagEvent => tagEvent.Patient.Id == _patientId;
                }
                else
                {
                    return tagEvent => tagEvent.Patient.Id == _patientId && tagEvent.Tag.Id == _tagId;
                }
            }
        }
    }
}
