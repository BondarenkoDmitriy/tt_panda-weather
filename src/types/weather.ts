export type Lang = 'uk' | 'en';

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon: string;
  cityName: string;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  icon: string;
  description: string;
}

export interface DayForecast {
  date: string;
  label: string;
  avgTemp: number;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
  hourly: ForecastItem[];
}

export type ViewMode = 'day' | 'week';
export type ThemeMode = 'day' | 'night';

export interface FavoriteCity extends City {
  id: string;
}

export interface WeatherBlockData {
  id: string;
  city: City | null;
}
