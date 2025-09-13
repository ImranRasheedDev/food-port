import { Home, MapPin } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const UpdateLocation = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Set Your Location</h2>
            <div>
                <img src="/images/map.jpg" alt="" className='w-full h-40 object-cover' />
            </div>
            <div className='flex justify-between items-center mt-4'>
                <div>
                    <p className='flex gap-x-2'> <MapPin /> Your address : 13th Street 47 W 13th St, New York, NY 10011, USA</p>
                </div>
                <div>
                    <Link to={"/set-location"} className=' underline'>
                        Edit
                    </Link>
                </div>
            </div>
            <div className='my-4'>
                <p>Saved addresses</p>
            </div>
            <div>
                <p className='flex gap-x-2'><Home /> Home</p>
            </div>
        </div>
    )
}

export default UpdateLocation