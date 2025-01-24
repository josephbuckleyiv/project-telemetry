using OpenTelemetry.Logs;
using OpenTelemetry;
using Microsoft.Data.Sqlite;
using OTelTest_1;

class Exporter : BaseExporter<LogRecord>
{
    public override ExportResult Export(in Batch<LogRecord> batch)
    {
        using var scope = SuppressInstrumentationScope.Begin();
        var stuff = new TimeSeriesModel { Date = DateTimeOffset.Now.ToUnixTimeSeconds() };
        SqliteDatabase.PostData(stuff);
        foreach (var record in batch)
        {
            Console.WriteLine($"Export: {record}");

        }

        return ExportResult.Success;
    }


    


}