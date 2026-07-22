# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-screen weather PWA styled as an iPhone weather app. It shows live conditions, an hourly forecast, and a 5-day forecast for three hardcoded cities (San Francisco, New York, Chicago), swipeable like the iOS Weather app's city pager. Live at https://claude-figma-test-silk.vercel.app/.

## Tech Stack

- React 18 + Vite 5 (no router, no state library — one component holds all state)
- Plain CSS (no Tailwind/CSS-in-JS) — one stylesheet per component
- Open-Meteo API (`api.open-meteo.com`) for weather data, no API key required
- picsum.photos for seeded per-city background photos
- Installable PWA: `public/manifest.json` + a hand-written service worker at `public/sw.js`
- ESLint 9 flat config (`eslint.config.js`)
- Deployed on Vercel (auto-deploy from `main`)

## Architecture

Almost all logic lives in `src/WeatherApp.jsx`, a single ~230-line component:
- `CITIES` — hardcoded array of `{ name, lat, lon }`; adding a city means adding an entry here (and to `CITY_BG`).
- `CITY_BG` — maps city name to a seeded picsum.photos background URL.
- `getWeatherInfo(code)` — maps Open-Meteo WMO weather codes to an emoji icon + description.
- `formatHour` / `formatDate` / `formatClockTime` / `formatDayName` — display formatting helpers; `formatDayName` parses `YYYY-MM-DD` as local date components (not `new Date(dateStr)`) specifically to avoid UTC-offset day-shifting bugs.
- `fetchWeather(city)` — hits Open-Meteo for current/hourly/daily forecast in Fahrenheit.
- The component fetches all three cities in parallel on mount (`Promise.all`) and keeps them all in `weatherData` state, so swiping cities is instant (no per-swipe fetch, no refetch on swipe).
- A `setInterval` clock re-renders the status bar time every second.
- City navigation is touch-swipe only (`onTouchStart`/`onTouchEnd` on the phone frame, threshold 40px), with `fadeKey` bumped to re-trigger the CSS fade-in animation on city change.

`App.jsx` and `main.jsx` are thin wrappers; `main.jsx` also registers `public/sw.js` as the service worker. `App.css` is leftover default Vite/React template CSS — no current markup uses its classes (`.logo`, `.card`, `.read-the-docs`); don't assume it's live styling.

The visual "phone frame" (`.weather-phone`) is a fixed 390×844 mockup on desktop and expands to fill the real viewport under `@media (max-width: 479px)` in `WeatherApp.css`, where the fake status bar is hidden in favor of the OS's real one and `env(safe-area-inset-*)` handles notch/Dynamic Island spacing.

`public/sw.js` uses a network-first strategy for `open-meteo.com` requests (never serve stale weather from cache when online) and cache-first for everything else (app shell). Bumping the `CACHE` constant is how you force clients to drop old cached assets.

## Coding Conventions

- Functional components with hooks only; no class components.
- Formatting helpers and constants (`CITIES`, `CITY_BG`, `getWeatherInfo`, `formatHour`, etc.) are plain top-level functions in the same file as their only consumer, not extracted into a `lib/`/`utils/` directory — this is a one-component app, keep it that way unless it grows.
- CSS class names are hand-namespaced with a `weather-` prefix (BEM-ish, not CSS Modules).

## Testing and Quality

There is no test suite or type checker configured. Before considering a change complete, run:
- `npm run lint`
- `npm run build` (catches Vite/React build errors)
- Manually verify in the browser: city swiping, loading state, and both the desktop phone-frame layout and the sub-480px mobile layout (resize/use device emulation).

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview production build: `npm run preview`
- Lint: `npm run lint`
