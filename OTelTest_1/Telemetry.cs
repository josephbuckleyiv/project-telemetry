using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;

namespace OTelTest_1
{
    public class Telemetry<T>(ILogger<T> logger)
    {

        public ILogger<T> Logger { get; } = logger;
        //public Metrics<T> Metrics { get; } = metrics;
        public TResult Instrument<TResult>(Func<TResult> func, [CallerMemberName] string name = "Unknown")
        {

            //Metrics.MethodCalled(name);
            try
            {
                Logger.LogInformation(name);
                return func();
            }
            catch (Exception ex)
            {
                //Metrics.MethodCallFailed(name);
                Logger.LogError(ex, ex.Message);
                throw;
            }
        }


    }
}
