import { getWeatherIconUrl } from '../api/weather';
import { formatTime } from '../i18n/translations';
import { useUser } from '../context/UserContext';
import type { CurrentWeather } from '../types/weather';
import './WeatherCard.css';

interface WeatherCardProps {
  weather: CurrentWeather;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  showFavoriteButton?: boolean;
}

export function WeatherCard({
  weather,
  isFavorite,
  onToggleFavorite,
  showFavoriteButton = true,
}: WeatherCardProps) {
  const { lang, t } = useUser();

  return (
    <div className={`weather-card ${isFavorite ? 'weather-card--favorite' : ''}`}>
      <div className="weather-card__header">
        <div>
          <h3 className="weather-card__city">
            {weather.cityName}, {weather.country}
          </h3>
          <p className="weather-card__description">{weather.description}</p>
        </div>
        {showFavoriteButton && (
          <button
            type="button"
            className={`weather-card__favorite-btn ${isFavorite ? 'weather-card__favorite-btn--active' : ''}`}
            onClick={onToggleFavorite}
            title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          >
            ★
          </button>
        )}
      </div>

      <div className="weather-card__main">
        <img
          src={getWeatherIconUrl(weather.icon)}
          alt={weather.description}
          className="weather-card__icon"
        />
        <span className="weather-card__temp">{weather.temp}°C</span>
      </div>

      <p className="weather-card__feels">
        {t('feelsLike')}: {weather.feelsLike}°C
      </p>

      <div className="weather-card__details">
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">{t('humidity')}</span>
          <span>{weather.humidity}%</span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">{t('pressure')}</span>
          <span>
            {weather.pressure} {t('hPa')}
          </span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">{t('wind')}</span>
          <span>
            {weather.windSpeed} {t('mps')}
          </span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">{t('sunrise')}</span>
          <span>{formatTime(weather.sunrise, lang)}</span>
        </div>
        <div className="weather-card__detail">
          <span className="weather-card__detail-label">{t('sunset')}</span>
          <span>{formatTime(weather.sunset, lang)}</span>
        </div>
      </div>
    </div>
  );
}
