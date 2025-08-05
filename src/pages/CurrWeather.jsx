import { css } from '@emotion/react'

export default function NowCard({ data }) {
  const cardStyles = css`
    width: 100%;
    background-color: #e9e9e9;
    border-radius: 16px;
    padding: 2rem 1.5rem;
    margin: 0rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1a1a1a;
  `

  const headerStyles = css`
    font-size: 1.2rem;
    font-weight: 500;
    color: #333;
    text-align: left;
  `
  

  const rowStyles = css`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    img {
      width: 70px;
      height: 70px;
    }

    .section {
      flex: 1 1 120px;
      margin: 0.5rem;
      text-align: center;
    }

    .temp {
      font-size: 2rem;
      font-weight: 600;
      color: #007BFF;
    }

    .label {
      font-size: 0.85rem;
      color: #666;
      margin-top: 0.3rem;
    }

    @media (max-width: 768px) {
      flex-wrap: wrap;

      .section {
        flex: 1 1 45%;
      }
    }
  `

  return (
    <div css={cardStyles}>
      <div css={headerStyles}>Current Weather</div>

      <div css={rowStyles}>
        <div className="section">
          <img
            src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <div className="label">{data.weather[0].description}</div>
        </div>

        <div className="section">
          <div className="temp">{data.main.temp.toFixed(0)}ºF</div>
          <div className="label">Temperature</div>
        </div>

        <div className="section">
          <div>{data.main.feels_like.toFixed(0)}ºF</div>
          <div className="label">Feels Like</div>
        </div>

        <div className="section">
          <div>{(data.pop * 100).toFixed(0)}%</div>
          <div className="label">Precipitation</div>
        </div>

        <div className="section">
          <div>{data.main.humidity}%</div>
          <div className="label">Humidity</div>
        </div>

        <div className="section">
          <div>{data.wind.speed} mph</div>
          <div className="label">Wind</div>
        </div>
      </div>
    </div>
  )
}
