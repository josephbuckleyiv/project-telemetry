import React from 'react';
import {
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Line
} from "recharts"

import { filter, interval, switchMap } from 'rxjs';
import { useEffect } from 'react';

// Hooks
import useInitialize from '../../hooks/useInitialize';

// Types
import { Time } from '../../utils/types';

// Style
import './timegraph.css'

export const TimeGraph: React.FC = () => {

    const { initialized, initialize, data, setData, fetchTimeSlice } = useInitialize({ TimeFilter: Time.Seconds });


    // You initialize the graph
    useEffect(() => {
        initialize();
    }, [initialize])

    useEffect(() => {
        const queryInterval$ = interval(1000).pipe(
            filter(() => initialized),
            switchMap(fetchTimeSlice),
        );

        const subscription = queryInterval$.subscribe(setData);

        return () => {
            subscription.unsubscribe();
        }
    }, [fetchTimeSlice, initialized, setData])


    return (
        <div className="timegraph border rounded" style={{ height: "200px"} }>
            <ResponsiveContainer>
            <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: -10,
                    bottom: 5,
                }}
            >
                <XAxis dataKey="Date" />
                <YAxis />
                <Line isAnimationActive={true} animationDuration={1000} type="monotone" dataKey="Count" stroke="#82ca9d" dot={false} />
            </LineChart>
            </ResponsiveContainer>
        
        </div>

    )
}

