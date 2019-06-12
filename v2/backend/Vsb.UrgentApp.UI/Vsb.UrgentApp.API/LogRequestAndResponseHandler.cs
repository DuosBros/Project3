using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using NLog;

namespace Vsb.UrgentApp.API
{
    public class LogRequestAndResponseHandler : DelegatingHandler
    {
        private static readonly Logger Log = LogManager.GetCurrentClassLogger();

        protected override async Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            // log request body
            string requestBody = await request.Content.ReadAsStringAsync();

            if (!string.IsNullOrEmpty(requestBody))
            {
                Log.Debug(requestBody);
            }
            
            // let other handlers process the request
            var result = await base.SendAsync(request, cancellationToken);

            if (result.Content != null)
            {
                // once response body is ready, log it
                var responseBody = await result.Content.ReadAsStringAsync();
                Log.Debug(responseBody);
            }

            return result;
        }
    }
}