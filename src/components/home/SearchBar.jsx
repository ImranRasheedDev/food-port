import { MapPin, Search } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '../ui/input'
import SearchCard from '../Cards/SearchCard'
import SearchContainer from '../Cards/SearchContainer'
import LocationSearchCard from '../Cards/LocationSearchCard'
import CurrentLocationCard from '../Cards/CurrentLocationCard'
import { useRestaurants } from '@/hooks/api'
import { Skeleton } from '@/components/ui/skeleton'
import usePlacesAutocomplete, { getGeocode } from 'use-places-autocomplete'
import LayoutWrapper from '../layoutWrapper'
import { processImageUrl } from '@/lib/utils';
const SearchBar = () => {
    const [showSearch, setShowSearch] = useState(false)
    const [showLocation, setShowLocation] = useState(false)

    const [searchTerm, setSearchTerm] = useState('')
    const [locationTerm, setLocationTerm] = useState('')
    const [selectedAddress, setSelectedAddress] = useState('')

    // Debounce search term to limit API calls
    const [debouncedSearch, setDebouncedSearch] = useState('')
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300)
        return () => clearTimeout(t)
    }, [searchTerm])

    // Restaurants API call with mutually exclusive params based on active input
    const searchActive = !!(debouncedSearch && debouncedSearch.length > 0)
    const locationQueryText = (selectedAddress || locationTerm || '').trim()
    const locationActive = !!(locationQueryText.length > 0)

    const apiParams = (() => {
        if (searchActive) {
            return {
                search: debouncedSearch,
                limit: 50,
            }
        }
        if (locationActive) {
            return {
                search_address: locationQueryText,
                limit: 50,
            }
        }
        // Always return default params when search dropdown is open
        if (showSearch) {
            return { page: 1, limit: 20 }
        }
        return { page: 1, limit: 10 }
    })()

    // Create unique query key for search queries to avoid cache conflicts
    const searchQueryKey = searchActive ? ['restaurants', 'search', debouncedSearch] : 
                          locationActive ? ['restaurants', 'location', locationQueryText] : 
                          showSearch ? ['restaurants', 'default', 'dropdown'] :
                          ['restaurants', 'default']

    const { data: restaurantsResp, isLoading: isRestaurantsLoading } = useRestaurants(apiParams, {
        queryKey: searchQueryKey,
        staleTime: searchActive ? 30000 : 5 * 60 * 1000, // 30 seconds for search, 5 minutes for default
        cacheTime: searchActive ? 60000 : 10 * 60 * 1000, // 1 minute for search, 10 minutes for default
        enabled: true, // Always enabled
    })

    const restaurantSuggestions = useMemo(() => {
        const arr = restaurantsResp?.data?.data || restaurantsResp?.data || restaurantsResp?.results || []
        return Array.isArray(arr) ? arr : []
    }, [restaurantsResp])

    // Google Places for location input
    const {
        ready: placesReady,
        value: placesValue,
        setValue: setPlacesValue,
        suggestions: { status: placesStatus, data: placePredictions },
        clearSuggestions,
    } = usePlacesAutocomplete({ debounce: 300 })

    useEffect(() => {
        // keep hook value in sync with our input text
        if (locationTerm !== placesValue) {
            setPlacesValue(locationTerm, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locationTerm])

    const containerRef = useRef(null)

    const extractPostalCode = (components) => {
        if (!Array.isArray(components)) return ''
        const postalComp = components.find((c) => c.types?.includes('postal_code'))
        return postalComp?.long_name || ''
    }

    const handleSelectPrediction = async (description) => {
        setPlacesValue(description, false)
        clearSuggestions()
        try {
            const results = await getGeocode({ address: description })
            const components = results?.[0]?.address_components || []
            const zip = extractPostalCode(components)
            const display = zip || description
            setSelectedAddress(display)
            setLocationTerm(display)
        } catch (e) {
            setSelectedAddress(description)
            setLocationTerm(description)
        }
    }

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) return
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords
            try {
                const geocoder = new window.google.maps.Geocoder()
                geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
                    if (status === 'OK' && results && results[0]) {
                        const components = results[0].address_components || []
                        const zip = extractPostalCode(components)
                        const addr = zip || results[0].formatted_address
                        setSelectedAddress(addr)
                        setLocationTerm(addr)
                        setPlacesValue(addr, false)
                    }
                })
            } catch (e) {
                // no-op fallback if geocoder not available
            }
        })
    }

    return (
        <LayoutWrapper>
        <div className='mt-10'>
            <div className="bg-primary-995 rounded-md shadow-[inset_0px_0px_0px_1px_#F7F7F7] flex flex-col md:grid md:grid-cols-2 relative min-h-16 md:h-16">
                {/* Divider */}
                <div className='hidden md:block h-11 w-0.5 absolute left-1/2 top-1/2 -translate-y-1/2 bg-primary-999' />

                {/* Search input */}
                <div className="flex items-center relative pl-6 h-16 border-b md:border-b-0 border-primary-999" ref={containerRef}>
                    <Search className='text-primary-200' />
                    <Input
                        className="bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                        type="text"
                        placeholder='Search  for popluar restaurants, popular trucks'
                        value={searchTerm}
                        onFocus={() => setShowSearch(true)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={(e) => {
                            // Close after a short delay to allow click
                            setTimeout(() => setShowSearch(false), 150)
                        }}
                    />
                    {showSearch && !locationActive && (
                        <SearchContainer onMouseDown={(e) => e.preventDefault()}>
                            {isRestaurantsLoading && (
                                <div className="px-4 py-3 space-y-3">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <Skeleton className="w-12 h-12 rounded-md" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-2/3 mb-2" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!isRestaurantsLoading && restaurantSuggestions.length === 0 && debouncedSearch && (
                                <div className="px-4 py-4 text-sm text-gray-500">No results found</div>
                            )}
                            {!isRestaurantsLoading && restaurantSuggestions.length === 0 && !debouncedSearch && (
                                <div className="px-4 py-4 text-sm text-gray-500">Start typing to search restaurants...</div>
                            )}
                            {!isRestaurantsLoading && restaurantSuggestions.map((r) => (
                                <SearchCard
                                    key={r.id}
                                    img={processImageUrl(r.logo_url, '/images/placeholder1.jpg')}
                                    name={r.name}
                                    address={r.address}
                                    to={`/resturants-detail/${r.id}`}
                                    onClick={() => {
                                        setSearchTerm(r.name || '')
                                        setShowSearch(false)
                                    }}
                                />
                            ))}
                        </SearchContainer>
                    )}
                </div>

                {/* Location input */}
                <div className="flex items-center pl-6 pr-6 relative h-16">
                    <MapPin className='text-primary-200' />
                    <Input
                        className="bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:shadow-none"
                        type="text"
                        placeholder='Search by zipcode, state'
                        value={locationTerm}
                        onChange={(e) => {
                            setSelectedAddress('')
                            setLocationTerm(e.target.value)
                            setPlacesValue(e.target.value)
                        }}
                        onFocus={() => setShowLocation(true)}
                        onBlur={() => setTimeout(() => setShowLocation(false), 100)}
                    />
                    {showLocation && (
                        <SearchContainer onMouseDown={(e) => e.preventDefault()}>
                            {!(locationActive && (isRestaurantsLoading || restaurantSuggestions.length > 0)) && (
                                <>
                                    <CurrentLocationCard onClick={handleUseCurrentLocation} />
                                    {locationTerm.trim().length > 0 && placesStatus === 'OK' && placePredictions.length > 0 && (
                                        placePredictions.slice(0, 6).map(({ place_id, description }) => (
                                            <LocationSearchCard
                                                key={place_id}
                                                address={description}
                                                onClick={() => handleSelectPrediction(description)}
                                            />
                                        ))
                                    )}
                                </>
                            )}
                            {/* Restaurants for zipcode/address (location) search under right dropdown */}
                            {locationActive && (
                                <div className="border-t border-gray-200" />
                            )}
                            {locationActive && isRestaurantsLoading && (
                                <div className="px-4 py-3 space-y-3">
                                    {Array.from({ length: 4 }).map((_, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <Skeleton className="w-12 h-12 rounded-md" />
                                            <div className="flex-1">
                                                <Skeleton className="h-4 w-2/3 mb-2" />
                                                <Skeleton className="h-3 w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {locationActive && !isRestaurantsLoading && restaurantSuggestions.length === 0 && (
                                <div className="px-4 py-4 text-sm text-gray-500">No restaurants found for this location</div>
                            )}
                            {locationActive && !isRestaurantsLoading && restaurantSuggestions.map((r) => (
                                <SearchCard
                                    key={r.id}
                                    img={processImageUrl(r.logo_url) || '/images/placeholder.jpg'}
                                    name={r.name}
                                    address={r.address}
                                    to={`/resturants-detail/${r.id}`}
                                    onClick={() => {
                                        setLocationTerm(locationQueryText)
                                        setShowLocation(false)
                                    }}
                                />
                            ))}
                        </SearchContainer>
                    )}
                </div>
            </div>
        </div>
        </LayoutWrapper>
    )
}

export default SearchBar
