import { MapPin, Search } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '../ui/input'
import SearchCard from '../Cards/SearchCard'
import SearchContainer from '../Cards/SearchContainer'
import LocationSearchCard from '../Cards/LocationSearchCard'
import CurrentLocationCard from '../Cards/CurrentLocationCard'

const SearchBar = () => {
    const [showSearch, setShowSearch] = useState(false)
    const [showLocation, setShowLocation] = useState(false)

    return (
        <div className='container mx-auto px-4 mt-10'>
            <div className="bg-primary-995 rounded-md shadow-[inset_0px_0px_0px_1px_#F7F7F7] grid grid-cols-2 relative h-16">
                {/* Divider */}
                <div className='h-11 w-0.5 absolute left-1/2 top-1/2 -translate-1/2  bg-primary-999' />

                {/* Search input */}
                <div className="flex items-center relative pl-6">
                    <Search className='text-primary-200' />
                    <Input
                        className="bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                        type="text"
                        placeholder='Search for restaurants, cuisines, and dishes'
                        onFocus={() => setShowSearch(true)}
                        onBlur={() => setShowSearch(false)}
                    />
                    {showSearch && (
                        <SearchContainer>
                            <SearchCard img="/images/burger-king.jpg" name="Burger King" address="1207 N Marine Blvd, Jacksonville" />
                            <SearchCard img="/images/burger-king.jpg" name="Burger King" address="1207 N Marine Blvd, Jacksonville" />
                            <SearchCard img="/images/burger-king.jpg" name="Burger King" address="1207 N Marine Blvd, Jacksonville" />
                            <SearchCard img="/images/burger-king.jpg" name="Burger King" address="1207 N Marine Blvd, Jacksonville" />
                        </SearchContainer>
                    )}
                </div>

                {/* Location input */}
                <div className="flex items-center pl-6 pr-6 relative">
                    <MapPin className='text-primary-200' />
                    <Input
                        className="bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                        type="text"
                        placeholder='Enter delivery location'
                        onFocus={() => setShowLocation(true)}
                        onBlur={() => setShowLocation(false)}
                    />
                    {showLocation && (
                        <SearchContainer>
                            <CurrentLocationCard />
                            <LocationSearchCard address="1207 N Marine Blvd, Jacksonville" />
                            <LocationSearchCard address="1207 N Marine Blvd, Jacksonville" />
                            <LocationSearchCard address="1207 N Marine Blvd, Jacksonville" />
                            <LocationSearchCard address="1207 N Marine Blvd, Jacksonville" />
                        </SearchContainer>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SearchBar
