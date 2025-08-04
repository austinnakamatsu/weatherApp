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

    const styles = css `
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        width: 10rem;
        margin: 0.5rem;
        font-family: 'Inter', 'Segoe UI', sans-serif;
        text-align: center;
        transition: transform 0.2s ease-in-out;
        
        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        }
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
        margin: 0.5rem 0;
    `

    const iconStyle = css`
        width: 60px;
        height: 60px;
    `

    const precipStyle = css`
        font-size: 0.75rem;
        color: #888;;
    `

    const strong = css`
        font-size: 1.5rem;
        font-weight: 800;`
    const tempRow = css`
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
    `

    
    if (isDaily) {
    return (
      <div css={styles}>
        <p>{dayOfWeek}</p>
        <p css={dateStyle}>{month} {day}, {year}</p>
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
            <p css={precipStyle}>Precipitation: {precip.toFixed(0)}%</p>
        </div>
    )
}