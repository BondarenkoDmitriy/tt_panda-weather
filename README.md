# Weather App

Тестове завдання — додаток погоди на React + Vite + axios + Chart.js.

## Вимоги ТЗ

- Автокомпліт міст (OpenWeatherMap Geocoding API)
- Картка погоди на поточний день
- Графік температури (Chart.js) — по годинах / по днях
- До 5 блоків погоди з кнопкою "+"
- Видалення блоків з модальним підтвердженням
- Вкладка "Вибране" (localStorage, max 5)
- Адаптивність (360px – 1200px)
- Перемикання день / 5 днів
- Визначення міста за IP
- Прелоадери
- Багатомовність uk/en
- Перемикання теми день/ніч

## Стек

- **React 18** + TypeScript
- **Vite** — збірка
- **axios** — HTTP-запити
- **Chart.js** + react-chartjs-2 — графіки
- Власний CSS (без фреймворків і UI-бібліотек)

## Запуск

1. Отримайте API-ключ на [openweathermap.org](https://openweathermap.org/api)
2. Скопіюйте `.env.example` → `.env` і вставте ключ:

```
VITE_OPENWEATHER_API_KEY=ваш_ключ
```

3. Встановіть залежності та запустіть:

```bash
npm install
npm run dev
```

## Деплой (безкоштовно)

Рекомендовані платформи:

| Платформа | Переваги |
|-----------|----------|
| **[Vercel](https://vercel.com)** | Найпростіший деплой для Vite/React, автоматичний CI з GitHub |
| **[Netlify](https://netlify.com)** | Аналогічно Vercel, drag-and-drop або Git |
| **[GitHub Pages](https://pages.github.com)** | Безкоштовно для публічних репозиторіїв |

### Деплой на Vercel

1. Завантажте проєкт на GitHub
2. Зареєструйтесь на vercel.com → Import Project
3. Додайте змінну середовища `VITE_OPENWEATHER_API_KEY`
4. Deploy

### Деплой на Netlify

1. `npm run build` → папка `dist`
2. netlify.com → Add new site → Import from Git
3. Build command: `npm run build`, Publish directory: `dist`
4. Додайте `VITE_OPENWEATHER_API_KEY` в Environment variables

## Додаткова функціональність

- Перемикання теми день/ніч (впливає на іконки погоди та кольорову схему)
- Визначення міста користувача за IP (ip-api.com)
- Багатомовний інтерфейс та відповіді API (uk/en)
- Прелоадери при завантаженні даних
- Адаптивна сітка блоків

## Структура

```
src/
├── api/weather.ts          # axios-запити до OpenWeatherMap
├── components/             # UI-компоненти
├── hooks/useFavorites.ts   # localStorage для вибраного
├── i18n/translations.ts    # переклади uk/en
└── types/weather.ts        # TypeScript типи
```
