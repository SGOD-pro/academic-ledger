import Script from 'next/script'
import React from 'react'

function Loader() {
    return (
        <div className='w-full flex justify-center items-center p-4'>
            <Script type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/infinity.js"></Script>
            <l-infinity
                size="60"
                stroke="4"
                stroke-length="0.15"
                bg-opacity="0.1"
                speed="1.3"
                color="#00ADB5"
            ></l-infinity>
        </div>
    )
}

export default Loader