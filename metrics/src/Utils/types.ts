
export type TimeSeriesDataPoint = {
    Date: number,
    Count: number
}

export type DisplayPoint = {
    Date: number
}

export type TimeFilter = {
    Seconds: 1,
    Minutes: 60,
    Hours: 3600
}

export enum Time {
    Seconds = 59,
}

export type ChartOptions = {
    TimeFilter: Time
}

export type GraphControls = {
    initialized: boolean,
    initialize: () => Promise<void>,
    data: TimeSeriesDataPoint[],
    setData: React.Dispatch<React.SetStateAction<TimeSeriesDataPoint[]>> ,
    fetchTimeSlice: () => Promise<TimeSeriesDataPoint[]>

}

export type InitializeFunction = (arg: ChartOptions) => GraphControls;