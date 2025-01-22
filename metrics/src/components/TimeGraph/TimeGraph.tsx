import React from 'react';
import { TimeSeriesDataPoint } from '../../Utils/types';
import {
    LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Line
} from "recharts"

const TimeGraph: React.FC<{ points: TimeSeriesDataPoint[]} > = ({ points }) => {












    return (<ResponsiveContainer>
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

export default TimeGraph;