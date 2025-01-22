using OpenTelemetry.Logs;
using OpenTelemetry;

class Exporter : BaseExporter<LogRecord>
{
    public override ExportResult Export(in Batch<LogRecord> batch)
    {
        using var scope = SuppressInstrumentationScope.Begin();

        foreach (var record in batch)
        {
            Console.WriteLine($"Export: {record}");
        }

        return ExportResult.Success;
    }
}