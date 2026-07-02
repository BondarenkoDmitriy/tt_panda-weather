import axios from 'axios';
import type { City, CurrentWeather, DayForecast, ForecastItem, Lang } from '../types/weather';
import { formatDate } from '../i18n/translations';
import { getErrorMessage } from '../i18n/errors';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export function isApiKeyConfigured(): boolean {
  return Boolean(API_KEY && API_KEY !== 'your_api_key_here');
}

function getApiErrorMessage(status?: number): string {
  if (!isApiKeyConfigured()) {
    return getErrorMessage('apiKey');
  }
  if (status === 401) {
    return getErrorMessage('unauthorized');
  }
  return getErrorMessage('fetch');
}

function assertApiKey(): void {
  if (!isApiKeyConfigured()) {
    throw new Error(getApiErrorMessage());
  }
}

const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org',
});

export async function searchCities(query: string, country?: string): Promise<City[]> {
  if (!query.trim()) return [];
  assertApiKey();

  const searchQuery = country ? `${query},${country}` : query;

  try {
    const { data } = await weatherApi.get('/geo/1.0/direct', {
      params: {
        q: searchQuery,
        limit: 5,
        appid: API_KEY,
      },
    });

    return data.map((item: { name: string; country: string; lat: number; lon: number }) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(getApiErrorMessage(error.response?.status));
    }
    throw error;
  }
}

export async function geocodeUkraineCity(cityName: string, _lang: Lang): Promise<City | null> {
  const results = await searchCities(cityName, 'UA');
  const match =
    results.find((city) => city.country === 'UA' && city.name.toLowerCase() === cityName.toLowerCase()) ||
    results.find((city) => city.country === 'UA') ||
    results[0];

  return match ?? null;
}

export async function reverseGeocode(lat: number, lon: number, lang: Lang): Promise<City | null> {
  assertApiKey();

  try {
    const { data } = await weatherApi.get('/geo/1.0/reverse', {
      params: {
        lat,
        lon,
        limit: 1,
        appid: API_KEY,
        lang,
      },
    });

    if (!data[0]) return null;

    return {
      name: data[0].name,
      country: data[0].country,
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch {
    return null;
  }
}

function getBrowserCoordinates(): Promise<{ lat: number; lon: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lon: position.coords.longitude }),
      () => resolve(null),
      { timeout: 8000, maximumAge: 300000 },
    );
  });
}

export async function getCurrentWeather(city: City, lang: Lang): Promise<CurrentWeather> {
  assertApiKey();

  try {
    const { data } = await weatherApi.get('/data/2.5/weather', {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: API_KEY,
        units: 'metric',
        lang,
      },
    });

    return {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      cityName: data.name,
      country: data.sys.country,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(getApiErrorMessage(error.response?.status));
    }
    throw error;
  }
}

export async function getForecast(city: City, lang: Lang): Promise<ForecastItem[]> {
  assertApiKey();

  try {
    const { data } = await weatherApi.get('/data/2.5/forecast', {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: API_KEY,
        units: 'metric',
        lang,
      },
    });

    return data.list.map((item: {
      dt: number;
      main: { temp: number };
      weather: { icon: string; description: string }[];
    }) => ({
      dt: item.dt,
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      description: item.weather[0].description,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(getApiErrorMessage(error.response?.status));
    }
    throw error;
  }
}

export function groupForecastByDay(items: ForecastItem[], lang: Lang): DayForecast[] {
  const groups = new Map<string, ForecastItem[]>();

  for (const item of items) {
    const date = new Date(item.dt * 1000);
    const key = date.toISOString().split('T')[0];
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return Array.from(groups.entries())
    .slice(0, 5)
    .map(([date, hourly]) => {
      const temps = hourly.map((h) => h.temp);
      const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
      const mid = hourly[Math.floor(hourly.length / 2)];

      return {
        date,
        label: formatDate(new Date(date), lang),
        avgTemp,
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        icon: mid.icon,
        description: mid.description,
        hourly,
      };
    });
}

export function getTodayHourlyForecast(items: ForecastItem[]): ForecastItem[] {
  const today = new Date().toISOString().split('T')[0];
  return items.filter((item) => {
    const itemDate = new Date(item.dt * 1000).toISOString().split('T')[0];
    return itemDate === today;
  });
}

export async function getCityByIp(lang: Lang = 'uk'): Promise<City | null> {
  const ipProviders = [
    async (): Promise<City | null> => {
      const { data } = await axios.get('https://ipwho.is/', { timeout: 5000 });
      if (!data.success || !data.city) return null;
      return {
        name: data.city,
        country: data.country_code || data.country || '',
        lat: data.latitude,
        lon: data.longitude,
      };
    },
    async (): Promise<City | null> => {
      const { data } = await axios.get('https://get.geojs.io/v1/ip/geo.json', { timeout: 5000 });
      if (!data.city) return null;
      return {
        name: data.city,
        country: data.country_code || '',
        lat: Number(data.latitude),
        lon: Number(data.longitude),
      };
    },
  ];

  for (const provider of ipProviders) {
    try {
      const city = await provider();
      if (city) return city;
    } catch {
      // try next provider
    }
  }

  try {
    const coords = await getBrowserCoordinates();
    if (coords) {
      return await reverseGeocode(coords.lat, coords.lon, lang);
    }
  } catch {
    // silent fail
  }

  return null;
}

export function getWeatherIconUrl(icon: string): string {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}
