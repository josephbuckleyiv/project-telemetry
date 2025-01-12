import { useRef, useState } from 'react';
import './App.css';
import {
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Line
} from "recharts"
import { useEffect } from 'react';
import { filter, interval, switchMap,  map, pipe, mergeMap } from 'rxjs';

// Classes
import { TimeSeriesBuffer } from './TimeSeriesBuffer.ts';
import { RingBuffer } from './RingBuffer.ts';

// Types
import { TimeSeriesDataPoint } from './Utils/types.ts';
import { useMemo } from 'react';
import { useCallback } from 'react';


const graph = (points: TimeSeriesDataPoint[]) => {
    console.log("RERENDER")
    return ( <ResponsiveContainer>
        <LineChart
            width={500}
            height={300}
            data={points}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            
        >
            <XAxis dataKey="Date" />
            <YAxis />
            <Line isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="Count" stroke="#82ca9d" dot={false} />
        </LineChart>
    </ResponsiveContainer>
    )
}

function App() {
    const MINUTE_DIFFERENCE = 59;

    const [initialized, setInitialized] = useState(false);

    const [data, setData] = useState([] as TimeSeriesDataPoint[]);
    const buf = new TimeSeriesBuffer();
    const ringBuf = useMemo(() => new RingBuffer(60), []);

    // Time Related
    const currentTime = useRef(Math.floor(Date.now() / 1000));
    const showingUntil = useRef(currentTime.current - MINUTE_DIFFERENCE); // This is initialized later.

    const post = async () => {
            fetch("http://localhost:5000/post")
            .then(response => response.json())
    }

    /* This initializes the graph, upon initial render. */
    const initialize = useCallback( async () => {
        fetch("http://localhost:5000/initialize")
            .then(response => response.json())
            .then(data => ringBuf.Initialize(data))
            .then(() => {
                setData(ringBuf.Data());
                showingUntil.current = !ringBuf.Data().length ? 0 : ringBuf.Data().at(-1).Date as number;
                setInitialized(true)
            })

    }, [ringBuf]);

    useEffect(() => {
        initialize()
    }, [initialize])

    //useEffect(() => {
    //    setInterval(getTimeSlice, 1000);
    //}, [getTimeSlice])

    /* This is the pipline for time-slice retrieval. */
    useEffect(() => {
        const fetchTimeSlice = async () => { // ISSUE IS HERE!!!!!!!!!!!
            currentTime.current = Math.floor(Date.now() / 1000);
            await fetch(`http://localhost:5000/getTimeSlice?start=${showingUntil.current}&end=${currentTime.current}`)
                .then(response => response.json())
                .then(vals => {
                    vals.map(val => ringBuf.Add(val));
                })
            showingUntil.current = currentTime.current;

            // SHALLOW COPY!
            const vals = [ ...ringBuf.Data()];
            return vals;
        };


        const queryInterval$ = interval(1000).pipe(
            filter(() => initialized),
            switchMap(fetchTimeSlice),
        );

        const subscription = queryInterval$.subscribe(setData);

        return () => {
            subscription.unsubscribe();
        }
    }, [initialized, ringBuf])

  return (
      <>
          <div style={{ width: "400px", height: "300px" }}>
              { graph(data) }
          </div>
          <button onClick={post}> Press to end world hunger</button>
          <button onClick={initialize}> GIMME!</button>
    </>
  )
}

export default App
