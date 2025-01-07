import { useState } from 'react';
import './App.css';
import {
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Line
} from "recharts"
import { useEffect } from 'react';
import { from, interval, switchMap, map, pipe, mergeMap } from 'rxjs';


// Classes
import { TimeSeriesBuffer } from './TimeSeriesBuffer.ts';
import { RingBuffer } from './RingBuffer.ts';

// Types
import { TimeSeriesDataPoint } from './Utils/types.ts';
import { useMemo } from 'react';
import { useCallback } from 'react';

function App() {

    const [data, setData] = useState([] as TimeSeriesDataPoint[]);
    const buf = new TimeSeriesBuffer();
    const ringBuf = useMemo(() => new RingBuffer(60), []);

    const post = async () => {
            fetch("http://localhost:5000/post")
            .then(response => response.json())
            //.then(data => console.log(data))
            //.catch((err) => console.log(err));
    }
    
    const initialize = useCallback( async () => {
        fetch("http://localhost:5000/initialize")
            .then(response => response.json())
            .then(data => ringBuf.Initialize(data))
            .then(() => setData(ringBuf.Data()))
        //.then(data => console.log(data))
        //.catch((err) => console.log(err));
    }, [ringBuf]);

    const getTimeSlice = useCallback( async () => {
        fetch("http://localhost:5000/getTimeSlice")
            .then(response => response.json())
            .then((data) => ringBuf.Add(data))
            .then(() => setData(ringBuf.Data()))
        //.then(data => console.log(data))
        //.catch((err) => console.log(err));
    }, [ringBuf]);

    /* Initialize the graph */
    useEffect(() => {
        initialize()
    }, [initialize])

    //useEffect(() => {
    //    setInterval(getTimeSlice, 1000);
    //}, [getTimeSlice])

    const queryInterval$ = interval(1000).pipe(
        switchMap(() => fetch("http://localhost:5000/getTimeSlice")
            .then(response => response.json())
            .then(vals => { ringBuf.Add(vals); return vals })),
    );

    useEffect(() => {
        queryInterval$.subscribe((vals) => {
            console.log(ringBuf.Data())
            setData(ringBuf.Data());
        })
    }, [])

    console.log(data)
  return (
      <>
          <div style={{ width: "400px", height: "300px" }}>
              <ResponsiveContainer>
               <LineChart
                width={500}
                height={300}
                      data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="Date" />
                <YAxis />
                <Line type="monotone" dataKey="Count" stroke="#82ca9d" dot={false} />
            </LineChart>
        </ResponsiveContainer>
          </div>
          <button onClick={post}> Press to end world hunger</button>
          <button onClick={getTimeSlice}> TIME SLICE</button>
          <button onClick={initialize}> GIMME!</button>
    </>
  )
}

export default App
