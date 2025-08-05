import { css } from '@emotion/react'
import { times } from 'lodash'

export default function Card(props) {
    let data = props.data
    const isDaily = props.isDaily || false;
    const timezoneOffset = props.timezoneOffset
    const tempMax = isDaily ? data.temp_max : data.main.temp_max;
    const tempMin = isDaily ? data.temp_min : data.main.temp_min;
    const descText = data.weather?.[0]?.description || "N/A";
    const iconCode = data.weather?.[0]?.icon || "01d";
    const precip = (data.pop ?? 0) * 100;
    const vis = data.visibility
    const humidity = data?.main?.humidity
    const windSpd = data?.wind?.speed
    const windDeg = data?.wind?.deg
    const clouds = data?.clouds?.all


    const orgDate = new Date(data.dt_txt);
    const localTimestamp = orgDate.getTime() + timezoneOffset * 60 * 60 * 1000;
    const date = new Date(localTimestamp);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Convert visibility meters to km and miles string
    function formatVisibility(meters) {
        if (meters == null) return 'N/A';
        const miles = (meters / 1609.344).toFixed(1);
        return `${miles} mi`;
    }

    // Convert wind speed from m/s to mph string
    function formatWindSpeed(metersPerSecond) {
        if (metersPerSecond == null) return 'N/A';
        const mph = (metersPerSecond * 2.23694).toFixed(1);
        return `${mph} mph`;
    }

    // Convert wind degrees to compass direction string
    function getWindDirection(degrees) {
        if (degrees == null) return 'N/A';
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.floor((degrees + 11.25) / 22.5) % 16;
        return `${directions[index]} (${degrees}°)`;
    }

    const styles = css`
        background: #e9e9e9;
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        padding: 0.75rem 1rem;
        width: 10rem;
        margin: 0.5rem;
        font-family: 'Inter', 'Segoe UI', sans-serif;
        text-align: center;
        transition: transform 0.2s ease-in-out;
    `
    const dateStyle = css`
        font-size: 0.95rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #222;
    `
    const timeStyle = css`
        font-size: 0.8rem;
        color: #666;
    `

    const bluetemp = css`
        color: blue !important;
        margin: 0.4rem 0;
        font-weight: 600;
    `

    const redtemp = css`
        color: red !important;
        margin: 0.4rem 0;
        font-weight: 600;
    `
    const description = css`
        font-size: 0.85rem;
        color: #555;
        text-transform: capitalize;
        margin: 1rem 0;
    `

    const iconStyle = css`
        width: 60px;
        height: 60px;
    `

    const precipStyle = css`
        font-size: 0.75rem;
        color: #888;;
    `

    const tempRow = css`
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
    `

    const dailyStyle = css`
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #ddd;
        gap: 1rem;
        font-size: 0.95rem;
        background-color: #e9e9e9;
    `
    const dayStyle = css`
        width: 50px;
        font-weight: bold;
    `

    const detailGrid = css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.5rem 1rem;
        font-size: 0.75rem;
        padding-top: 1rem;
        border-top: 1px solid #eee;
    `

    const label = css`
        font-weight: 600;
        color: #555;
        display: block;
        margin-top: 0.5rem;
        margin-bottom: 0.25rem;
    `
    
    if (isDaily) {
    return (
      <div css={dailyStyle}>
        <p css={dayStyle}>{dayOfWeek}</p>
        <img
          css={iconStyle}
          src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
          alt={descText}
        />
        <div css={tempRow}>
            <p css={bluetemp}>{tempMin.toFixed(1)}ºF</p>
            <p css={redtemp}>{tempMax.toFixed(1)}ºF</p>
        </div>
        
        <p css={precipStyle}>Precipitation: {precip.toFixed(0)}%</p>
      </div>
    );
  }

    return (
        <div css={styles}>
        {/* <p>Date Time Text: {data.dt_txt}</p> */}
            <img
                css={iconStyle}
                src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                alt = "Weather icon"/>
            <p css={dateStyle}>{month} {day}, {year}</p>
            {!isDaily && (
                <p css={timeStyle}>{hours}:{minutes} {ampm}</p>
            )}
            <p css={redtemp}>High: {tempMax}ºF</p>
            <p css={bluetemp}>Low: {tempMin}ºF</p>
            <p css={description}>{descText}</p>
            <div css={detailGrid}>
                <div>
                    <span css={label}>Precipitation:</span> {precip.toFixed(0)}%
                </div>
                <div>
                    <span css={label}>Cloudiness:</span> {clouds}%
                </div>
                <div>
                    <span css={label}>Wind Speed:</span> {formatWindSpeed(windSpd)}
                </div>
                <div>
                    <span css={label}>Direction:</span> {getWindDirection(windDeg)}
                </div>
                <div>
                    <span css={label}>Visibility:</span> {formatVisibility(vis)}
                </div>
                <div>
                    <span css={label}>Humidity:</span> {humidity}%
                </div>
            </div>
            
        </div>
    )
}