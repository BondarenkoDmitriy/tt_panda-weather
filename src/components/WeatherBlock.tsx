import { useCallback, useEffect, useState } from 'react';
import {
  getCurrentWeather,
  getForecast,
  getTodayHourlyForecast,
  groupForecastByDay,
} from '../api/weather';
import { getErrorMessage } from '../i18n/errors';
import { useUser } from '../context/UserContext';
import type { City, CurrentWeather, DayForecast, ForecastItem, ViewMode } from '../types/weather';
import { CitySelector } from './CitySelector';
import { Loader } from './Loader';
import { TemperatureChart } from './TemperatureChart';
import { WeatherCard } from './WeatherCard';
import './WeatherBlock.css';

interface WeatherBlockProps {
  city: City | null;
  onCityChange?: (city: City) => void;
  onDelete?: () => void;
  showDelete?: boolean;
  showCityInput?: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function WeatherBlock({
  city,
  onCityChange,
  onDelete,
  showDelete = false,
  showCityInput = true,
  isFavorite,
  onToggleFavorite,
}: WeatherBlockProps) {
  const { lang, themeMode, t } = useUser();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [forecastItems, setForecastItems] = useState<ForecastItem[]>([]);
  const [dayForecasts, setDayForecasts] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const [current, forecast] = await Promise.all([
        getCurrentWeather(city, lang),
        getForecast(city, lang),
      ]);

      setWeather(current);
      setForecastItems(forecast);
      setDayForecasts(groupForecastByDay(forecast, lang));
    } catch (err) {
      const message = err instanceof Error ? err.message : getErrorMessage('fetch');
      setError(message);
      setWeather(null);
      setForecastItems([]);
      setDayForecasts([]);
    } finally {
      setLoading(false);
    }
  }, [city, lang, t]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  function handleCitySelect(selected: City) {
    onCityChange?.(selected);
  }

  const hourlyData = forecastItems.length > 0
    ? getTodayHourlyForecast(forecastItems).map((item) => ({
        label: new Date(item.dt * 1000).toLocaleTimeString(lang === 'uk' ? 'uk-UA' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        temp: item.temp,
      }))
    : [];

  const weeklyChartData = dayForecasts.map((day) => ({
    label: day.label,
    temp: day.avgTemp,
  }));

  const displayWeather = weather
    ? {
        ...weather,
        icon:
          themeMode === 'night' && weather.icon.endsWith('d')
            ? weather.icon.replace('d', 'n')
            : weather.icon,
      }
    : null;

  return (
    <div className="weather-block">
      <div className="weather-block__toolbar">
        {showCityInput && (
          <div className="weather-block__search">
            <CitySelector value={city} onSelect={handleCitySelect} />
          </div>
        )}

        <div className="weather-block__controls">
          <div className="toggle-group">
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'day' ? 'toggle-btn--active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              {t('day')}
            </button>
            <button
              type="button"
              className={`toggle-btn ${viewMode === 'week' ? 'toggle-btn--active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              {t('week')}
            </button>
          </div>

          {showDelete && onDelete && (
            <button
              type="button"
              className="btn btn--danger btn--icon"
              onClick={onDelete}
              title={t('deleteBlock')}
              aria-label={t('deleteBlock')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {loading && <Loader text={t('loading')} />}

      {error && !loading && <p className="weather-block__error">{error}</p>}

      {!city && !loading && <p className="weather-block__empty">{t('noCity')}</p>}

      {displayWeather && !loading && (
        <>
          <WeatherCard
            weather={displayWeather}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            showFavoriteButton
          />

          {viewMode === 'day' && hourlyData.length > 0 && (
            <TemperatureChart
              data={hourlyData}
              title={t('hourlyChart')}
            />
          )}

          {viewMode === 'week' && weeklyChartData.length > 0 && (
            <>
              <div className="weather-block__week-list">
                {dayForecasts.map((day) => (
                  <div key={day.date} className="weather-block__week-item">
                    <span className="weather-block__week-day">{day.label}</span>
                    <span className="weather-block__week-temp">
                      {day.minTemp}° / {day.maxTemp}°
                    </span>
                    <span className="weather-block__week-avg">{day.avgTemp}°</span>
                  </div>
                ))}
              </div>
              <TemperatureChart
                data={weeklyChartData}
                title={t('dailyChart')}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
