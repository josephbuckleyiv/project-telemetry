
import { TimeSeriesDataPoint } from './types.ts';

export class TimeSeriesBuffer {
    private _buffer: TimeSeriesDataPoint[];
    private _length: number;

    constructor() {
        this._buffer = [];
        this._length = 0;
    }

    Add(dataPoint: TimeSeriesDataPoint): void {
        this._length++;
        this._buffer.push(dataPoint);
    }

    Pop(): TimeSeriesDataPoint {
        if (!this._length) {
            throw new Error("NO ELEMENTS IN BUFFER");
        }

        this._length--;
        return this._buffer.shift() as TimeSeriesDataPoint;
    }

}