// components/NowCard.jsx
import { css } from '@emotion/react'

export default function NowCard({ data }) {
  const styles = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    background-color: #eef6ff;
    border: 1px solid #007BFF;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    margin-bottom: 1rem;
    width: 100%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

    img {
      width: 80px;
      height: 80px;
    }

    .section {
      flex: 1 1 150px;
      margin: 0.5rem;
    }

    .temp {
      font-size: 2rem;
      font-weight: bold;
    }
  `

  return (
    <div css={styles}>
      <div className="section">
        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="Weather icon" />
      </div>
      <div className="section temp">{data.main.temp.toFixed(0)}ºF</div>
      <div className="section">Feels like: {data.main.feels_like.toFixed(0)}ºF</div>
      <div className="section">{data.weather[0].description}</div>
      <div className="section">Precipitation: {(data.pop * 100).toFixed(0)}%</div>
      <div className="section">Humidity: {data.main.humidity}%</div>
      <div className="section">Wind: {data.wind.speed} mph</div>
    </div>
  )
}
