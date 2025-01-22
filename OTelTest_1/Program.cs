using Microsoft.Extensions.Logging;
using OpenTelemetry;
using OpenTelemetry.Logs;
using OTelTest_1;

public class Program
{
   static async Task Main(string[] args)
    {
        // https://github.com/open-telemetry/opentelemetry-dotnet/tree/main/docs/logs/extending-the-sdk
        var loggerFactory = LoggerFactory.Create(builder =>
        {
            builder.AddOpenTelemetry(options =>
            {
                options.AddProcessor(new BatchLogRecordExportProcessor(new Exporter()));
            });
        });


        Telemetry<ApiServer> telemetry = new Telemetry<ApiServer>(loggerFactory.CreateLogger<ApiServer>());

        var server = new ApiServer(5000, telemetry);
        await server.StartAsync();
    }

}