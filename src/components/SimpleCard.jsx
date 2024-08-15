import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SimpleCard = () => {
    const [batchCard, setBatchCard] = useState({
        name: "",
        time: ""
    })
    useEffect(() => {
        const currentDate = new Date();
        const currentDayIndex = currentDate.getDay();
        axios.get(`/api/batches/nextBatch?day=${days[currentDayIndex]}`)
            .then((response) => {
                setBatchCard({
                    name: response.data.data.subject,
                    time:`${response.data.data.startTime} - ${response.data.data.endTime}`
                })
            })
            .catch(error => console.error(error));
    }, [])

    return (
        <div className={` w-full ${batchCard.name!==""?'h-24':'h-full'} p-2`} key={batchCard.name} >
        {batchCard.name!==""?
            <div className='h-full rounded p-2 bg-[#1F2937] w-full'>
                <h2 className='text-xl font-bold'>{batchCard.name}</h2>
                <p className=' no-underline'>Time: {batchCard.time}</p>
            </div>
            :
            <h2 className="text-xl">No more Batches for today</h2>
        }
        </div>
    );
};

export default memo(SimpleCard);
