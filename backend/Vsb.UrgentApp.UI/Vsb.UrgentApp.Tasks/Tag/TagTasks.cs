using RtlsEngine.DB;
using System.Collections.Generic;
using NLog;
using Vsb.UrgentApp.Common.Helpers;
using Vsb.UrgentApp.Common.Mappers;
using Vsb.UrgentApp.Infrastructure.Db;

namespace Vsb.UrgentApp.Tasks.Tag
{
	public class TagTasks : ITagTasks
    {
	    private static Logger Log = LogManager.GetCurrentClassLogger();
		private readonly IBaseMapper baseMapper;

		public TagTasks(
			IBaseMapper baseMapper)
        {		
			this.baseMapper = Requires.IsNotNull(baseMapper, nameof(baseMapper));
		}

        public List<TagDto> GetAll()
        {
			try
			{
				MyDataSet ds = new MyDataSet();
				ds.EnforceConstraints = false;

				FireBirdConnection.SelectQuery(
					FireBirdConnection.Connection,
					ds.Tag, Queries.TAG_SELECT);

				List<TagDto> lst = baseMapper.BindDataList<TagDto>(ds.Tag);

				return lst;
			}
			catch (System.Exception ex)
			{
				Log.Error(ex);
				throw;
			}
          
		}

		public TagDto GetById(int id)
        {
			TagDto result = new TagDto();

			MyDataSet ds = new MyDataSet();
            ds.EnforceConstraints = false;

			FireBirdConnection.SelectQuery(
                FireBirdConnection.Connection,
                ds.Tag, string.Format(UrgentAppQueries.TAG_SELECT_BYID, id));

			result = baseMapper.BindData<TagDto>(ds.Tag);

			return result;
        }
	}
}
