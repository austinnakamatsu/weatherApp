import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { css } from '@emotion/react'
import debounce from 'lodash/debounce'

// For interactive map
import 'leaflet/dist/leaflet.css'
// import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa'
import WeatherMap from '../components/WeatherMap'

import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'
import Card from './Card'
import NowCard from './CurrWeather'

export default function Search() {
    const [ searchParams, setSearchParams ] = useSearchParams()
    const query = searchParams.get("q")
    const [ inputQuery, setInputQuery ] = useState(query || "")
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [locationLabel, setLocationLabel] = useState("")
    const [showMap, setShowMap] = useState(false)
    // for autocomplete and search logic
    const [suggestions, setSuggestions] = useState([])
    const [recentSearches, setRecentSearches] = useState(
        JSON.parse(localStorage.getItem("recentSearches")) || []
    )
    const [inputFocused, setInputFocused] = useState(false)
    const [selectedTimezone, setSelectedTimezone] = useState('HST'); // default to HST


    const styles = css`
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
    `
    const forecastLayout = css`
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        `

    const dailyStyles = css`
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    `

    const hourlyStyles = css`
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-x: auto;
        gap: 0.5rem;
        padding-bottom: 1rem;
    `
    const hourlyRow = css`
        display: flex;
        flex-direction: row;  /* Cards in a row */
        gap: 0.5rem;
        padding: 0.5rem 0;
    `
    const TIMEZONES = {
        HST: -10,
        AKST: -9,
        PST: -8,
        MST: -7,
        CST: -6,
        EST: -5,
        UTC: 0,
        CET: 1,
        IST: 5.5,
        JST: 9,
        AEST: 10,
    };


    async function fetchSuggestions(query) {
        if (!query) {
            setSuggestions([])
            return
        }

        // autocomplete feature
        try {
            const res = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&limit=5`, {
                headers: {
                    'X-RapidAPI-Key': 'd5da914eb4msh2c08b9a6ea5d60dp1d3011jsn36028c3cac3f',
                    'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
                }
            })

            const result = await res.json()
            console.log("API result:", result)

            const citySuggestions = result.data.map((city) => ({
                name: `${city.city}, ${city.country}`,
                lat: city.latitude,
                lon: city.longitude
            }))
                setSuggestions(citySuggestions)
        } catch (err) {
            console.error("Autocomplete error:", err)
            setSuggestions([])
        }
    }
    // wait 300ms until calling fetchsuggestions
    const debouncedFetch = debounce((query) => {
        fetchSuggestions(query)
    }, 300)
    function handleInputChange(e) {
        const value = e.target.value
        setInputQuery(value)
        debouncedFetch(value)

        if (value.trim() === "") {
            setSuggestions([]) // Hide suggestions if empty
        } else {
            fetchSuggestions(value)
        }
    }

    function handleFocus() {
        setInputFocused(true)
        if (inputQuery.trim() === "") {
            // Show recent searches when focused and empty
            const recent = JSON.parse(localStorage.getItem("recentSearches")) || []
            setSuggestions(recent.map(name => ({ name, recent: true })))
        }
    }

    function handleBlur() {
        // Optional: Delay blur so user can click a suggestion
        setTimeout(() => setInputFocused(false), 150)
    }

    function handleSuggestionClick(suggestion) {
        if (suggestion.recent) {
            setInputQuery(suggestion.name)
            fetchSuggestions(suggestion.name)
        } else {
            setLatitude(parseFloat(suggestion.lat))
            setLongitude(parseFloat(suggestion.lon))
            setUseCurrentLocation(true)
            reverseGeocode(suggestion.lat, suggestion.lon)
            setInputQuery("")
            setSuggestions([])

            // Save to recent
            const updated = [suggestion.name, ...recentSearches.filter(c => c !== suggestion.name)].slice(0, 5)
            setRecentSearches(updated)
            localStorage.setItem("recentSearches", JSON.stringify(updated))
        }
    }


    useEffect(() => {
    if (!query && !useCurrentLocation && latitude === null && longitude === null) {
        navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude

            setLatitude(lat)
            setLongitude(lon)
            setUseCurrentLocation(true)

            await reverseGeocode(lat, lon)
        },
        (error) => {
            console.error("Geolocation error:", error)
        }
        )
    }
    }, [])
    useEffect(() => {
    if (useCurrentLocation && latitude !== null && longitude !== null) {
        reverseGeocode(latitude, longitude)
    }
    }, [latitude, longitude, useCurrentLocation])

    const currentWeatherQuery = useQuery({
    queryKey: ["currentWeather", latitude, longitude, query],
    enabled: useCurrentLocation ? latitude !== null && longitude !== null : !!query,
    queryFn: async () => {
        let url = ""
        if (useCurrentLocation && latitude && longitude) {
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=405ca8342de3d3f680984519d59250a3`
        } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&appid=405ca8342de3d3f680984519d59250a3`
        }

        const res = await fetch(url)
        if (!res.ok) {
        throw new Error("Unable to fetch current weather")
        }
        return res.json()
    }
    })


    const forecastQuery = useQuery({
    queryKey: [ "searchForecast", query, latitude, longitude, useCurrentLocation ],
    enabled: useCurrentLocation ? latitude !== null && longitude !== null : !!query,
    queryFn: async () => {
        console.log("== query function called")
        let url = "";

        if (useCurrentLocation && latitude && longitude) {
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=405ca8342de3d3f680984519d59250a3`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&appid=405ca8342de3d3f680984519d59250a3`;
        }

        const res = await fetch(url);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Something went wrong');
        }
        return res.json();
    }
});
    // for the daily forecast
    function getDailySummaries(forecastList) {
    const days = {}

    forecastList.forEach(item => {
        const date = new Date(item.dt_txt)
        const dayKey = date.toISOString().split("T")[0] // e.g., "2025-08-03"

        if (!days[dayKey]) {
        days[dayKey] = {
            dt: item.dt,
            dt_txt: item.dt_txt,
            weather: item.weather,
            pop: item.pop,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
        }
        } else {
        days[dayKey].temp_max = Math.max(days[dayKey].temp_max, item.main.temp_max)
        days[dayKey].temp_min = Math.min(days[dayKey].temp_min, item.main.temp_min)
        }
    })

    return Object.values(days).slice(0, 5) // Return next 5 days
    }


    const groupedDailyForecast = forecastQuery.data
    ? getDailySummaries(forecastQuery.data.list)
    : []

    async function reverseGeocode(lat, lon) {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`
            );
            const data = await res.json();
            if (data && data.address) {
                const { city, town, village, state, country } = data.address;
                setLocationLabel(city || town || village || state || country || "Unknown location");
            } else {
                setLocationLabel("Unknown location");
            }
        } catch (err) {
            console.error("Reverse geocoding failed:", err);
            setLocationLabel("Unknown location");
        }
    }

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault()
                if (!inputQuery.trim()) return

                setSearchParams({ q: inputQuery })
                setUseCurrentLocation(false)

                // Save manually typed search to recent
                const updated = [inputQuery, ...recentSearches.filter(item => item !== inputQuery)].slice(0, 5)
                setRecentSearches(updated)
                localStorage.setItem("recentSearches", JSON.stringify(updated))

                setSuggestions([])
            }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <input
                        value={inputQuery}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="Search for a city (City, State)"
                        style={{ width: '100%', padding: '0.5rem' }}
                    />
                </div>
                {inputFocused && suggestions.length > 0 && (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        background: '#fff',
                        position: 'absolute',
                        zIndex: 1000,
                        width: '300px'
                    }}>
                        {suggestions.map((s, i) => (
                        <li
                            key={i}
                            onClick={() => handleSuggestionClick(s)}
                            style={{
                            padding: '0.5rem',
                            cursor: 'pointer',
                            background: s.recent ? '#f9f9f9' : '#fff',
                            borderBottom: '1px solid #eee'
                            }}
                        >
                            {s.name} {s.recent && <span style={{ fontSize: '0.8rem', color: '#888' }}> (recent)</span>}
                        </li>
                        ))}
                    </ul>
                )}
                <button type="submit">Search</button>
                <button type="button" onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setLatitude(position.coords.latitude)
                            setLongitude(position.coords.longitude)
                            setUseCurrentLocation(true)
                            setSearchParams({})
                        },
                        (error) => {
                            console.error("Error getting location:", error);
                            alert("Unable to access your location. Please allow permission or try again.");
                        }
                    );
                }}>
                    Use My Location
                </button>
                <button type="button" onClick={() => setShowMap(true)}>
                📍 Pick location on map
                </button>
                {showMap && (
                    <div style={{ position: 'relative', zIndex: 1000 }}>
                        <div style={{
                        position: 'fixed',
                        top: 0, left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                        }}>
                        <div style={{
                            width: '90%',
                            maxWidth: '900px',
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1rem',
                            position: 'relative'
                        }}>
                            <button
                            onClick={() => setShowMap(false)}
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                fontSize: '1.5rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            >
                            ✖
                            </button>

                            <WeatherMap
                            onSelectLocation={({ lat, lng }) => {
                                setLatitude(lat);
                                setLongitude(lng);
                                setUseCurrentLocation(true);
                                setSearchParams({});
                                reverseGeocode(lat, lng);
                                setShowMap(false); // auto-close on select
                            }}
                            />
                        </div>
                        </div>
                    </div>
                    )}
            </form>
            <div style={{ marginTop: '1rem' }}>
                <label htmlFor="timezone">Timezone: </label>
                <select
                    id="timezone"
                    value={selectedTimezone}
                    onChange={(e) => setSelectedTimezone(e.target.value)}
                >
                    {Object.entries(TIMEZONES).map(([label, offset]) => (
                    <option key={label} value={label}>
                        {label} (UTC{offset >= 0 ? '+' : ''}{offset})
                    </option>
                    ))}
                </select>
            </div>
            <h2>Weather Results for: {" "}
                {useCurrentLocation
                ? locationLabel || "Loading location..."
                : query || "No location selected"}
            </h2>
            {currentWeatherQuery.data && (
            <NowCard
                data={{
                ...currentWeatherQuery.data,
                pop: 0 // no 'pop' in current weather endpoint, so we mock 0%
                }}
            />
            )}
            {forecastQuery.data && (
                <div css={forecastLayout}>
                    <div css={dailyStyles}>
                    <h3>Daily Forecast</h3>
                    {groupedDailyForecast.map(day => (
                        <Card key={day.dt} data={day} isDaily timezoneOffset={TIMEZONES[selectedTimezone]}/>
                    ))}
                    </div>
                    <div css={hourlyStyles}>
                    <h3>Daily Outlook</h3>
                    <div css={hourlyRow}>
                        {forecastQuery.data.list.slice(0, 12).map(hour => (
                            <Card key={hour.dt} data={hour} timezoneOffset={TIMEZONES[selectedTimezone]}/>
                        ))}
                    </div>
                    </div>
                </div>
                )}

            {forecastQuery.error && <ErrorContainer>Error: {forecastQuery.error.message}</ErrorContainer>}
            {forecastQuery.isLoading && <Spinner />}
            <ul css={styles}>
                {forecastQuery.data?.list && forecastQuery.data.list.map(repo => (
                    <li key={repo.dt}>
                        <Card data={repo} timezoneOffset={TIMEZONES[selectedTimezone]}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}
