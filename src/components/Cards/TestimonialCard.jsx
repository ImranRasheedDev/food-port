import React from 'react'

const TestimonialCard = ({ avatar, name, age, text, index, activeIndex }) => {
    return (
        <div
            className={`h-full bg-white rounded-lg px-6 py-14 shadow-lg ${index === activeIndex ? "bg-white" : "bg-white/80"
                }`}
        >
            <div className="mb-4">
                <img
                    src={avatar || "/placeholder.svg"}
                    alt={name}
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div className='mt-6'>
                    <h4 className="font-semibold text-black text-xl mb-2    ">{name}</h4>
                    <p className=" text-gray-400">{age}</p>
                </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{text}</p>
        </div>
    )
}

export default TestimonialCard