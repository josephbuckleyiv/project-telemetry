
import { TimeSeriesDataPoint } from './Utils/types.ts';

export class RingBuffer {
    public _buffer: TimeSeriesDataPoint[];
    private _length: number;
    private _maxLength: number;
    private _latestDate: number;

    constructor(max : number) {
        this._buffer = [];
        this._length = 0;
        this._maxLength = max;
        this._latestDate = Date.now();
    }

    Add(dataPoint: TimeSeriesDataPoint): void {
        if (dataPoint.Date <= this._latestDate) return;
        if (this._length == this._maxLength) {
            this._buffer.push(dataPoint);
            this._buffer.shift();
            this._latestDate = dataPoint.Date;
            return;
        }

        this._latestDate = dataPoint.Date;
        this._length++;
        this._buffer.push(dataPoint);
    }

    Initialize(dataPoints: TimeSeriesDataPoint[]): void {
        this._length = 60;
        this._latestDate = dataPoints[59].Date
        this._buffer = dataPoints;
    }

    Data(): TimeSeriesDataPoint[] {
        return this._buffer;
    }

}