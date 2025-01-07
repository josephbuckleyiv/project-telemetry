using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace OTelTest_1
{
    public class ApiServer
    {
        private readonly HttpListener _listener;

        public ApiServer(int port)
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add($"http://localhost:{port}/");
        }

        public async Task StartAsync()
        {
            _listener.Start();
            Console.WriteLine("API Server started.");

            while (true)
            {
                var context = await _listener.GetContextAsync();
                var request = context.Request;

                if (request.HttpMethod == "GET" && request.Url?.AbsolutePath == "/post")
                {
                    var stuff = new TimeSeriesModel { Date = DateTimeOffset.Now.ToUnixTimeSeconds() };
                    SqliteDatabase.PostData(stuff);
                    var response = context.Response;
                    response.StatusCode = (int)HttpStatusCode.OK;
                    response.ContentType = "application/json";
                    response.Headers.Add("Access-Control-Allow-Origin", "*");
                    response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

                    var json = JsonSerializer.Serialize(stuff);
                    var buffer = Encoding.UTF8.GetBytes(json);
                    Console.WriteLine("Sending something");
                    response.OutputStream.Write(buffer);
                    response.Close();

                }
                else if (request.HttpMethod == "GET" && request.Url?.AbsolutePath == "/getTimeSlice")
                {
                    var stuff = new TimeSeriesModel { Date = DateTimeOffset.Now.ToUnixTimeSeconds() };
                    
                    var response = context.Response;
                    response.StatusCode = (int)HttpStatusCode.OK;
                    response.ContentType = "application/json";
                    response.Headers.Add("Access-Control-Allow-Origin", "*");
                    response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

                    var json = SqliteDatabase.GetTimeSlice(); ;
                    var buffer = Encoding.UTF8.GetBytes(json);
                    Console.WriteLine("Sending something");
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
                    Console.WriteLine("Sending something");
                    response.OutputStream.Write(buffer);
                    response.Close();

                }

                else
                {
                    var response = context.Response;
                    response.StatusCode = 404;
                }
            }

        }

        public void Stop()
        {
            _listener.Stop();
        }

    }
}
