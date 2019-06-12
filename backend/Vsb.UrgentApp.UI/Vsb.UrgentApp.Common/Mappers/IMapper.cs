using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vsb.UrgentApp.Common.Mappers
{
	public interface IMapper<in TInput, out TOutput>
	{
		TOutput MapFrom(TInput input);
	}

	public interface IMapper<in TInput1, in TInput2, out TOutput>
	{
		TOutput MapFrom(TInput1 input1, TInput2 input2);
	}

	public interface IMapper<in TInput1, in TInput2, in TInput3, out TOutput>
	{
		TOutput MapFrom(TInput1 input1, TInput2 input2, TInput3 input3);
	}
}
