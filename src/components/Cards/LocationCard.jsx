import React from 'react'

const LocationCard = ({ field, value, icon }) => {
    return (
        <div
            onClick={() => field.onChange(value)}
            className={`cursor-pointer shadow-xl w-36 h-24 font-medium flex justify-center items-center flex-col rounded-sm
                    ${field.value === value
                    ? "bg-primary-50 text-white border border-primary-50"
                    : "border border-primary-1009 text-primary-200"
                }`}
        >
            {/* <Home className="w-8 h-8" /> */}
            {icon}
            <p>{value}</p>
        </div>
    )
}

export default LocationCard