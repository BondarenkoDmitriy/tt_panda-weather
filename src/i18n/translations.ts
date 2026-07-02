import type { Lang } from '../types/weather';
import { getErrorMessage } from './errors';

const translations = {
  uk: {
    appTitle: 'Погода',
    tabMain: 'Головна',
    tabFavorites: 'Вибране',
    searchPlaceholder: 'Пошук міста...',
    selectCity: 'Оберіть місто',
    selectCityPlaceholder: 'Оберіть місто',
    orSearchCity: 'або знайдіть будь-яке місто',
    addBlock: 'Додати блок',
    deleteBlock: 'Видалити блок',
    confirmDelete: 'Ви впевнені, що хочете видалити цей блок?',
    confirm: 'Підтвердити',
    cancel: 'Скасувати',
    addToFavorites: 'Додати до вибраного',
    removeFromFavorites: 'Видалити з вибраного',
    favoritesLimit: 'Для додавання видаліть місто з вибраного, тому що максимум 5',
    day: 'День',
    week: '5 днів',
    themeDay: 'День',
    themeNight: 'Ніч',
    feelsLike: 'Відчувається',
    humidity: 'Вологість',
    pressure: 'Тиск',
    wind: 'Вітер',
    sunrise: 'Схід',
    sunset: 'Захід',
    loading: 'Завантаження...',
    noCity: 'Оберіть місто',
    noFavorites: 'Немає вибраних міст',
    maxBlocks: 'Максимум 5 блоків',
    mps: 'м/с',
    hPa: 'гПа',
    temperature: 'Температура',
    hourlyChart: 'Температура по годинах',
    dailyChart: 'Температура по днях',
    errorFetch: getErrorMessage('fetch'),
    errorCity: getErrorMessage('city'),
    errorApiKey: getErrorMessage('apiKey'),
    errorUnauthorized: getErrorMessage('unauthorized'),
    close: 'Закрити',
    language: 'Мова',
    additionalFeatures: 'Додатково: визначення міста за IP, перемикання день/ніч, багатомовність',
  },
  en: {
    appTitle: 'Weather',
    tabMain: 'Main',
    tabFavorites: 'Favorites',
    searchPlaceholder: 'Search city...',
    selectCity: 'Select a city',
    selectCityPlaceholder: 'Choose city',
    orSearchCity: 'or search any city',
    addBlock: 'Add block',
    deleteBlock: 'Delete block',
    confirmDelete: 'Are you sure you want to delete this block?',
    confirm: 'Confirm',
    cancel: 'Cancel',
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    favoritesLimit: 'To add a city, remove one from favorites, because the maximum is 5',
    day: 'Day',
    week: '5 days',
    themeDay: 'Day',
    themeNight: 'Night',
    feelsLike: 'Feels like',
    humidity: 'Humidity',
    pressure: 'Pressure',
    wind: 'Wind',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    loading: 'Loading...',
    noCity: 'Select a city',
    noFavorites: 'No favorite cities',
    maxBlocks: 'Maximum 5 blocks',
    mps: 'm/s',
    hPa: 'hPa',
    temperature: 'Temperature',
    hourlyChart: 'Hourly temperature',
    dailyChart: 'Daily temperature',
    errorFetch: getErrorMessage('fetch'),
    errorCity: getErrorMessage('city'),
    errorApiKey: getErrorMessage('apiKey'),
    errorUnauthorized: getErrorMessage('unauthorized'),
    close: 'Close',
    language: 'Language',
    additionalFeatures: 'Extras: IP geolocation, day/night theme, i18n',
  },
} as const;

export type TranslationKey = keyof typeof translations.uk;

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key];
}

export function formatDate(date: Date, lang: Lang): string {
  return date.toLocaleDateString(lang === 'uk' ? 'uk-UA' : 'en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatTime(timestamp: number, lang: Lang): string {
  return new Date(timestamp * 1000).toLocaleTimeString(lang === 'uk' ? 'uk-UA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
