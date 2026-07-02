export const ERROR_MESSAGES = {
  fetch: 'Failed to load data',
  city: 'City not found',
  apiKey:
    'API key is not configured. Create a .env file with VITE_OPENWEATHER_API_KEY=your_key and restart the dev server.',
  unauthorized:
    'API key is not active yet. Confirm your email on OpenWeatherMap and wait up to 2 hours, then restart npm run dev.',
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

export function getErrorMessage(key: ErrorMessageKey): string {
  return ERROR_MESSAGES[key];
}
