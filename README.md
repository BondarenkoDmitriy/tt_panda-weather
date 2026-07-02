# Weather App

[![Vercel](https://img.shields.io/badge/Live%20Demo-tt--panda--weather.vercel.app-000?style=flat&logo=vercel&logoColor=white)](https://tt-panda-weather.vercel.app)

A test assignment weather application built with React + Vite + axios + Chart.js.

## TZ Requirements

- City autocomplete (OpenWeatherMap Geocoding API)
- Weather card for the current day
- Temperature chart (Chart.js) — hourly / daily
- Up to 5 weather blocks with a "+" button
- Block deletion with a confirmation modal
- "Favorites" tab (localStorage, max 5)
- Responsive layout (360px – 1200px)
- Day / 5-day toggle
- City detection by IP
- Loaders
- i18n uk/en
- Day/night theme toggle

## Tech Stack

- **React 18** + TypeScript
- **Vite** — build tool
- **axios** — HTTP requests
- **Chart.js** + react-chartjs-2 — charts
- Custom CSS (no frameworks or UI libraries)

## Getting Started

1. Get an API key at [openweathermap.org](https://openweathermap.org/api)
2. Copy `.env.example` → `.env` and add your key:

```
VITE_OPENWEATHER_API_KEY=your_key
```

3. Install dependencies and run:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment (Free)

Recommended platforms:

| Platform | Benefits |
|----------|----------|
| **[Vercel](https://vercel.com)** | Easiest deploy for Vite/React, automatic CI from GitHub |
| **[Netlify](https://netlify.com)** | Similar to Vercel, drag-and-drop or Git |
| **[GitHub Pages](https://pages.github.com)** | Free for public repositories |

### Deploy on Vercel

1. Push the project to GitHub
2. Sign up at vercel.com → Import Project
3. Add environment variable `VITE_OPENWEATHER_API_KEY`
4. Deploy

### Deploy on Netlify

1. `npm run build` → `dist` folder
2. netlify.com → Add new site → Import from Git
3. Build command: `npm run build`, Publish directory: `dist`
4. Add `VITE_OPENWEATHER_API_KEY` in Environment variables

---

## TZ Implementation Guide

Point-by-point mapping of the technical specification to the codebase.

### 1. City input with autocomplete

**Requirement:** Input with autocomplete for cities.

**Implementation:** `CityAutocomplete` (`src/components/CityAutocomplete.tsx`)

- Debounced search (300 ms) via OpenWeatherMap Geocoding API (`/geo/1.0/direct`)
- Dropdown with up to 5 city suggestions
- Closes on outside click
- Loading indicator while fetching

**What is autocomplete?** As you type (e.g. "Ky"), the app suggests matching cities ("Kyiv, UA") without submitting a form.

### 2. axios for API requests

All weather and geocoding requests are in `src/api/weather.ts` using **axios**.

### 3. Weather card for the current day

`WeatherCard` displays temperature, feels-like, humidity, pressure, wind, sunrise/sunset, description, and icon.

### 4. Hourly temperature chart (Chart.js)

`TemperatureChart` uses **Chart.js** (line chart) with today's forecast intervals from the 5-day forecast API.

### 5. Multiple weather blocks (max 5)

- Default: 1 block on the Main tab
- **"+ Add block"** adds identical blocks (max 5)
- Each block has full city selection and weather functionality

### 6. Delete blocks with confirmation modal

Delete button (✕) appears when there is more than one block. `Modal` asks for confirmation before removal.

### 7. Favorites tab

| Sub-requirement | Status | Details |
|-----------------|--------|---------|
| Favorites tab | ✅ | Navigation tab "Favorites" |
| Add/remove city | ✅ | Star button (★) on weather cards (Main tab) |
| Highlight favorite | ✅ | Gold border + filled star (`weather-card--favorite`) |
| Favorites tab blocks | ✅ | Weather only — no city select/autocomplete |
| Day/week toggle only | ✅ | Day / 5 days toggle on favorites blocks |
| localStorage | ✅ | `useFavorites` hook → key `weather-favorites` |
| Max 5 favorites | ✅ | Enforced before adding |
| Limit modal | ✅ | Modal shown when trying to add a 6th city |
| Remove on Favorites tab | ✅ | Star button removes city from favorites |

### 8. Responsive layout (360px – 1200px)

- Container: `max-width: 1200px`, `min-width: 360px`
- Breakpoints in `App.css`:
  - **< 480px** — single column, compact header
  - **480–767px** — single column
  - **768–1023px** — 2 columns
  - **1024–1199px** — 2 columns
  - **≥ 1200px** — 3 columns

### 9. Day / 5-day toggle (*)

- **Day:** current weather card + hourly temperature chart
- **5 days:** daily list (min/max/avg) + chart with average daily temperature

Uses OpenWeatherMap `/data/2.5/forecast`.

### 10. Default weather by user IP (*)

`getCityByIp()` in `src/api/weather.ts` runs on first visit (when no saved cities exist):

1. [ipwho.is](https://ipwho.is/)
2. [geojs.io](https://get.geojs.io/) (fallback)
3. Browser Geolocation API + OpenWeatherMap reverse geocoding (last resort)

### 11. Loaders (*)

`Loader` spinner during weather fetch, autocomplete loading indicator, initial page loading state.

### 12. i18n en/uk (*)

- `UserContext` + `src/i18n/translations.ts`
- UI strings in Ukrainian and English
- API responses use `lang=uk` or `lang=en`
- API error messages are always in English (`src/i18n/errors.ts`)

### 13. Day / Night theme (***)

Global theme via `UserContext` → `html.theme-day` / `html.theme-night`. Affects the entire app. Weather icons switch to night variants in Night mode.

### 14. Extra features (**)

- **Ukraine city `<select>`** — quick picker for ~65 Ukrainian cities with uk/en display names
- **UserContext** — centralized language and theme with localStorage
- **App state persistence** — blocks, active tab, favorites, language, and theme survive page reload
- **Improved day theme** — stronger borders and card shadows
- **Dual IP geolocation providers** — more reliable default city detection

---

## Ukraine City Select (custom addition)

Each weather block includes a **`<select>` dropdown** with major Ukrainian cities:

- Ukrainian names in UK locale, English names in EN locale (e.g. Київ / Kyiv)
- Geocoding uses the Ukrainian name for accurate OpenWeatherMap results
- Includes cities across all regions, including temporarily occupied territories
- Data: `src/data/ukraineCities.ts`

The autocomplete below the select still allows searching **any city worldwide**.

---

## Additional Features

- Day/night theme (affects weather icons and color scheme)
- User city detection by IP (ipwho.is + geojs.io)
- Bilingual UI and API responses (uk/en)
- Loaders during data fetching
- Responsive block grid
- State persistence in localStorage

## Project Structure

```
src/
├── api/weather.ts           # axios requests to OpenWeatherMap + IP geolocation
├── components/              # UI components
│   ├── CityAutocomplete.tsx # Autocomplete input
│   ├── CitySelector.tsx     # Select + autocomplete combo
│   ├── WeatherBlock.tsx     # Single weather block
│   ├── WeatherCard.tsx      # Current weather card
│   ├── TemperatureChart.tsx # Chart.js line chart
│   ├── Modal.tsx            # Confirmation dialogs
│   └── Loader.tsx           # Loading spinner
├── context/UserContext.tsx  # Language, theme, translations
├── data/ukraineCities.ts    # Ukraine city list (uk/en)
├── hooks/
│   ├── useAppState.ts       # Blocks + active tab persistence
│   └── useFavorites.ts      # Favorites persistence
├── i18n/
│   ├── translations.ts      # UI strings (uk/en)
│   └── errors.ts            # API error messages (en)
└── types/weather.ts         # TypeScript types
```

## localStorage Keys

| Key | Content |
|-----|---------|
| `weather-blocks` | Main tab weather blocks and selected cities |
| `weather-active-tab` | `main` or `favorites` |
| `weather-favorites` | Up to 5 favorite cities |
| `weather-lang` | `uk` or `en` |
| `weather-theme` | `day` or `night` |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_OPENWEATHER_API_KEY` | API key from [openweathermap.org](https://openweathermap.org/api) |

## TZ Compliance Summary

| # | Requirement | Implemented |
|---|-------------|-------------|
| 1 | City autocomplete | ✅ |
| 2 | axios | ✅ |
| 3 | Weather card | ✅ |
| 4 | Chart.js hourly chart | ✅ |
| 5 | Up to 5 blocks | ✅ |
| 6 | Delete with modal | ✅ |
| 7 | Favorites tab | ✅ |
| 8 | Responsive 360–1200px | ✅ |
| 9* | Day / 5-day toggle | ✅ |
| 10* | IP geolocation default | ✅ |
| 11* | Loaders | ✅ |
| 12* | i18n en/uk | ✅ |
| 13*** | Day/night theme | ✅ |
| 14** | Extra features | ✅ |
