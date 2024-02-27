import { css } from '@emotion/react'

export default function Card(props) {
    let data = props.data
    const date = new Date(data.dt_txt)
    const month = date.toLocaleString('default', { month: 'short'})
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear()
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const styles = css `
        background-color: beige;
        margin: 0;
        display: inline-block;
        border: 1px solid;
        width: 12rem;
        height: 24rem;
        padding: 0.5rem;
        
    `

    const bluetemp = css `
        color: blue !important;`

    const redtemp = css`
        color: red !important;`

    const strong = css`
        font-size: 1.5rem;
        font-weight: 800;`

    return (
        <div css={styles}>
        {/* <p>Date Time Text: {data.dt_txt}</p> */}
            <p css={strong}>{month} {day}, {year}</p>
            <p>Time: {hours}:{minutes} {ampm}</p>
            <p css={redtemp}>High Temp: {data.main.temp_max}ºF</p>
            <p css={bluetemp}>Low Temp: {data.main.temp_min}ºF</p>
            <p>Description: {data.weather[0].description}</p>
            <img
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                alt = "Weather icon"/>
            <p>Precipitation: {(data.pop * 100).toFixed(0)}%</p>
        </div>
    )
}