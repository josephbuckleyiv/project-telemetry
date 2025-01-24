import { useState } from 'react';
import './meter.css'


import { interval, switchMap } from 'rxjs';
import { useEffect } from 'react';

export const Meter = () => {

    const [metric, setMetric] = useState(0);


    useEffect(() => {
        const fetchMetric = async () => {
            const vals = await fetch("http://localhost:5000/total")
                .then(response => response.json())
                .then(data => data);

            return vals;
        }

        const queryInterval$ = interval(1000).pipe(switchMap(fetchMetric));

        const subscription = queryInterval$.subscribe(setMetric);

        return () => {
            subscription.unsubscribe();
        }

    }, []);


    return (
        <div className="meter d-flex align-items-center justify-content-center text-center fs-1 border h-50 rounded">
            { metric }

        </div>
    )
}

