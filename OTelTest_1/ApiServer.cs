using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;

namespace OTelTest_1
{
    public class ApiServer
    {
        private readonly HttpListener _listener;
        private readonly Telemetry<ApiServer> _telemetry;

        public ApiServer(int port, Telemetry<ApiServer> tel)
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add($"http://localhost:{port}/");
            _telemetry = tel;
        }

        public async Task StartAsync()
        {

            await _telemetry.Instrument( async () =>
            {

                _listener.Start();
                Console.WriteLine("API Server started.");

                while (true)
                {
                    var context = await _listener.GetContextAsync();
                    var request = context.Request;
                    Uri uri = new Uri(request.Url.AbsoluteUri);
                    string query = uri.Query;
                    var queryParams = HttpUtility.ParseQueryString(query);


                    if (request.HttpMethod == "GET" && request.Url?.AbsolutePath == "/post")
                    {
                        PostData(context.Response);

                    }
                    else if (request.HttpMethod == "GET" && request.Url?.AbsolutePath == "/getTimeSlice")
                    {
                        var stuff = new TimeSeriesModel { Date = DateTimeOffset.Now.ToUnixTimeSeconds() };


                        var response = context.Response;
                        response.StatusCode = (int)HttpStatusCode.OK;
                        response.ContentType = "application/json";
                        response.Headers.Add("Access-Control-Allow-Origin", "*");
                        response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

                        var start = int.Parse(queryParams["start"]);
                        var end = int.Parse(queryParams["end"]);

                        var json = SqliteDatabase.GetTimeSlice(start, end);
                        var buffer = Encoding.UTF8.GetBytes(json);
                        response.OutputStream.Write(buffer);
                        response.Close();

                    }
                    else if (request.HttpMethod == "GET" && request.Url?.AbsolutePath == "/initialize")
                    {
                        var stuff = new TimeSeriesModel { Date = DateTimeOffset.Now.ToUnixTimeSeconds() };
                        //SqliteDatabase.PostData(stuff);
                        var response = context.Response;
                        response.StatusCode = (int)HttpStatusCode.OK;
                        response.ContentType = "application/json";
                        response.Headers.Add("Access-Control-Allow-Origin", "*");
                        response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

                        var json = SqliteDatabase.GetData();
                        var buffer = Encoding.UTF8.GetBytes(json);
                        response.OutputStream.Write(buffer);
                        response.Close();

                    }

                    else
                    {
                        var response = context.Response;
                        response.StatusCode = 404;
                    }

                }
            });
            

        }

        public void Stop()
        {
            _listener.Stop();
        }


        public async Task PostData(HttpListenerResponse res)
        {
            await _telemetry.Instrument(async () =>
            {
                var stuff = new TimeSeriesModel { Date = DateTimeOffset.Now.ToUnixTimeSeconds() };
                SqliteDatabase.PostData(stuff);
                var response = res;
                response.StatusCode = (int)HttpStatusCode.OK;
                response.ContentType = "application/json";
                response.Headers.Add("Access-Control-Allow-Origin", "*");
                response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

                var json = JsonSerializer.Serialize(stuff);
                var buffer = Encoding.UTF8.GetBytes(json);
                response.OutputStream.Write(buffer);
                response.Close();
                return;
            });
        }


    }
}
