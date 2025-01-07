using Microsoft.Data.Sqlite;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace OTelTest_1
{
    public static class SqliteDatabase
    {
        public static string  GetData()
        {
            try
            {
                using var connection = new SqliteConnection("Data Source=C:\\Users\\Joseph\\source\\repos\\OTelTest_1\\OTelTest_1\\metrics.db");
                SQLitePCL.Batteries.Init();
                connection.Open();

                SqliteCommand retrieve = new SqliteCommand(
                    @"WITH RECURSIVE dates AS (
                          SELECT (SELECT strftime('%s', 'now')) AS time
                          UNION ALL
                          SELECT time - 1
                          FROM dates
                          WHERE time > (SELECT strftime('%s', 'now')) - 59
                        )
                        SELECT CAST(time AS INTEGER), CAST(COUNT(m.Date) AS INTEGER)  FROM dates d
                        LEFT JOIN Metrics m ON m.Date > d.time - 5 AND m.Date < d.time
                        GROUP BY d.time;", connection);
                using SqliteDataReader reader = retrieve.ExecuteReader();

                ICollection<TimeSeriesModel> dataPoints = new List<TimeSeriesModel>();

                while (reader.Read())
                {
                    // Process the data here
                    TimeSeriesModel dataPoint = new TimeSeriesModel
                    {
                        Date = (long)reader.GetValue(0),
                        Count = (long)reader.GetValue(1)
                    };
                    dataPoints.Add(dataPoint);
                }

                return JsonSerializer.Serialize(dataPoints);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static string GetTimeSlice()
        {
            try
            {
                using var connection = new SqliteConnection("Data Source=C:\\Users\\Joseph\\source\\repos\\OTelTest_1\\OTelTest_1\\metrics.db");
                SQLitePCL.Batteries.Init();
                connection.Open();

                SqliteCommand retrieveTimeSlice = new SqliteCommand(@"
            SELECT CAST(strftime('%s', 'now') AS INTEGER) AS Current, CAST(COUNT(Date) AS INTEGER) FROM Metrics
            WHERE Date > strftime('%s', 'now') - 5 AND Date < strftime('%s', 'now');", connection);
                using SqliteDataReader reader = retrieveTimeSlice.ExecuteReader();

                ICollection<TimeSeriesModel> dataPoints = new List<TimeSeriesModel>();

                while (reader.Read())
                {
                    TimeSeriesModel dataPoint = new TimeSeriesModel
                    {
                        Date = (long)reader.GetValue(0),
                        Count = (long)reader.GetValue(1)
                    };
                    dataPoints.Add(dataPoint);
                }

                return JsonSerializer.Serialize(dataPoints);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static void PostData(TimeSeriesModel timeData)
        {
            try
            {
                using var connection = new SqliteConnection("Data Source=C:\\Users\\Joseph\\source\\repos\\OTelTest_1\\OTelTest_1\\metrics.db");
                SQLitePCL.Batteries.Init();
                connection.Open();

                SqliteCommand insert = new SqliteCommand("INSERT INTO Metrics (Date) VALUES (@date)", connection);
                insert.Parameters.Add(new SqliteParameter("@date", timeData.Date));
                insert.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }


        }


    }
}
