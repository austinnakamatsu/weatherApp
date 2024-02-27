import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { css } from '@emotion/react'

import ErrorContainer from '../components/ErrorContainer'
import Spinner from '../components/Spinner'
import Card from './Card'

export default function Search() {
    const [ searchParams, setSearchParams ] = useSearchParams()
    const query = searchParams.get("q")
    const [ inputQuery, setInputQuery ] = useState(query || "")

    const styles = css `
        margin: 0;
        display: flex;
        flex-wrap: wrap;
        list-style: none;
        padding: 0;
    `

    const { fetchStatus, isLoading, error, data } = useQuery({
        queryKey: [ "searchForecast", query ],
        queryFn: async () => {
            console.log("== query function called")
            // throw new Error("woops!")
            const res = await fetch(
                // `https://api.github.com/search/repositories?q=${query}`
                `https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=b69cd87cb80a292b73cd9033a67aefda&units=imperial`
            )
            return res.json()
        }
    })

    console.log("== isLoading:", isLoading)
    console.log("== fetchStatus:", fetchStatus)
    console.log("== response body:", data)

    return (
        <div>
            <form onSubmit={e => {
                e.preventDefault()
                setSearchParams({ q: inputQuery })
            }}>
                <input value={inputQuery} onChange={e => setInputQuery(e.target.value)} />
                <button placeholder="Enter City Name" type="submit">Search</button>
            </form>
            <h2>Weather Results for: {query}</h2>
            {error && <ErrorContainer>Error: {error.message}</ErrorContainer>}
            {isLoading && <Spinner />}
            <ul css={styles}>
                {data?.list && data.list.map(repo => (
                    <li key={repo.dt}>
                        <Card data={repo}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}
