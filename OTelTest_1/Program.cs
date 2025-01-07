using OTelTest_1;

public class Program
{
   static async Task Main(string[] args)
    {
        var server = new ApiServer(5000);
        await server.StartAsync();
    }

}