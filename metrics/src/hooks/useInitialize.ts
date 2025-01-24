import { useState, useCallback , useMemo, useRef} from "react";
import { RingBuffer } from "../utils/RingBuffer";
import { TimeSeriesDataPoint, InitializeFunction } from "../utils/types";

const useInitialize: InitializeFunction = ({ TimeFilter }) => {

    const [initialized, setInitialized] = useState(false);
    const ringBuf = useMemo(() => new RingBuffer(60), []);
    const [data, setData] = useState([] as TimeSeriesDataPoint[]);

    const currentTime = useRef(Math.floor(Date.now() / 1000));
    const showingUntil = useRef(currentTime.current - TimeFilter);

    const initialize = useCallback(async () => {
           fetch("http://localhost:5000/initialize")
            .then(response => response.json())
            .then(data => ringBuf.Initialize(data))
            .then(() => {
                setData(ringBuf.Data());
                showingUntil.current = !ringBuf.Data().length ? 0 : ringBuf.Data().at(-1)?.Date as number;
                setInitialized(true)
            })
    }, [ringBuf]);

    const fetchTimeSlice = async () => { // ISSUE IS HERE!!!!!!!!!!!
        currentTime.current = Math.floor(Date.now() / 1000);
        await fetch(`http://localhost:5000/getTimeSlice?start=${showingUntil.current}&end=${currentTime.current}`)
            .then(response => response.json())
            .then(vals => {
                vals.map((val: TimeSeriesDataPoint) => ringBuf.Add(val));
            })
        showingUntil.current = currentTime.current;

        // SHALLOW COPY!
        const vals = [...ringBuf.Data()];
        return vals;
    };


    return { initialized, initialize, data, setData, fetchTimeSlice  }
}

export default useInitialize;
