import { useState, useEffect } from 'react';
import './WeatherApp.css';

const CITIES = [
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { name: 'New York',      lat: 40.7128, lon: -74.006  },
  { name: 'Chicago',       lat: 41.8781, lon: -87.6298 },
];

function getWeatherInfo(code) {
  if (code === 0)                          return { icon: '☀',  desc: 'Clear' };
  if (code === 1)                          return { icon: '🌤', desc: 'Mainly Clear' };
  if (code === 2)                          return { icon: '⛅', desc: 'Partly Cloudy' };
  if (code === 3)                          return { icon: '☁',  desc: 'Overcast' };
  if (code === 45 || code === 48)          return { icon: '🌫', desc: 'Foggy' };
  if (code >= 51 && code <= 55)           return { icon: '🌦', desc: 'Drizzle' };
  if (code >= 61 && code <= 65)           return { icon: '🌧', desc: 'Rain' };
  if (code >= 71 && code <= 77)           return { icon: '🌨', desc: 'Snow' };
  if (code >= 80 && code <= 82)           return { icon: '🌦', desc: 'Showers' };
  if (code === 85 || code === 86)         return { icon: '🌨', desc: 'Snow Showers' };
  if (code >= 95)                          return { icon: '⛈', desc: 'Thunderstorm' };
  return { icon: '🌡', desc: 'Unknown' };
}

function formatHour(timeStr) {
  // timeStr: "2024-04-08T14:00"
  const hour = parseInt(timeStr.split('T')[1]);
  if (hour === 0)  return '12 AM';
  if (hour < 12)   return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatClockTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDayName(dateStr, index) {
  if (index === 0) return 'Today';
  // Parse as local date to avoid UTC offset shifting the day
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

async function fetchWeather(city) {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,weathercode` +
    `&hourly=temperature_2m,weathercode` +
    `&daily=weathercode,temperature_2m_max,temperature_2m_min` +
    `&temperature_unit=fahrenheit&timezone=auto&forecast_days=6`;
  const res = await fetch(url);
  return res.json();
}

export default function WeatherApp() {
  const [cityIndex, setCityIndex] = useState(0);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState(new Date());
  const [fadeKey, setFadeKey] = useState(0);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch all cities on mount
  useEffect(() => {
    async function loadAll() {
      const results = await Promise.all(CITIES.map(fetchWeather));
      const data = {};
      CITIES.forEach((city, i) => { data[city.name] = results[i]; });
      setWeatherData(data);
      setLoading(false);
    }
    loadAll();
  }, []);

  // Cycle cities every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCityIndex(i => (i + 1) % CITIES.length);
      setFadeKey(k => k + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const city = CITIES[cityIndex];
  const data = weatherData[city.name];

  let currentTemp = '--';
  let currentWeather = { icon: '…', desc: '' };
  let hourlyItems = [];
  let dailyItems = [];

  if (data) {
    currentTemp = Math.round(data.current.temperature_2m);
    currentWeather = getWeatherInfo(data.current.weathercode);

    // current.time matches one of the hourly slots
    const hourIdx = data.hourly.time.indexOf(data.current.time);
    const start = hourIdx >= 0 ? hourIdx : 0;
    hourlyItems = Array.from({ length: 6 }, (_, i) => {
      const idx = start + i;
      return {
        time: i === 0 ? 'Now' : formatHour(data.hourly.time[idx]),
        icon: getWeatherInfo(data.hourly.weathercode[idx]).icon,
        temp: Math.round(data.hourly.temperature_2m[idx]),
      };
    });

    dailyItems = data.daily.time.slice(0, 5).map((dateStr, i) => ({
      day: formatDayName(dateStr, i),
      icon: getWeatherInfo(data.daily.weathercode[i]).icon,
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
    }));
  }

  return (
    <div className="weather-page">
      <div className="weather-phone">
        {/* Status Bar */}
        <div className="weather-status-bar">
          <span className="weather-time">{formatClockTime(clock)}</span>
          <span className="weather-signal">5G ◉</span>
        </div>

        {/* Scroll Content */}
        <div className="weather-scroll-content">
          <div className="weather-city-temp" key={fadeKey}>
            <p className="weather-city">{city.name}</p>
            <p className="weather-date">{formatDate(clock)}</p>
            <div className="weather-main-icon">
              {loading ? '…' : currentWeather.icon}
            </div>
            <p className="weather-temperature">
              {loading ? '--' : `${currentTemp}°`}
            </p>
            <p className="weather-condition">
              {loading ? 'Loading…' : currentWeather.desc}
            </p>
            {data && (
              <p className="weather-hi-lo">
                H: {Math.round(data.daily.temperature_2m_max[0])}°
                &nbsp;&nbsp;&nbsp;
                L: {Math.round(data.daily.temperature_2m_min[0])}°
              </p>
            )}
          </div>

          {/* City dots */}
          <div className="weather-city-dots">
            {CITIES.map((c, i) => (
              <div
                key={c.name}
                className={`weather-city-dot${i === cityIndex ? ' active' : ''}`}
              />
            ))}
          </div>

          {/* Hourly Forecast */}
          <div className="weather-card">
            <p className="weather-card-label">HOURLY FORECAST</p>
            <div className="weather-divider" />
            <div className="weather-hourly-row">
              {loading
                ? <p className="weather-loading-text">Loading…</p>
                : hourlyItems.map(({ time, icon, temp }) => (
                  <div key={time} className="weather-hourly-item">
                    <span className="weather-hourly-time">{time}</span>
                    <span className="weather-hourly-icon">{icon}</span>
                    <span className="weather-hourly-temp">{temp}°</span>
                  </div>
                ))
              }
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="weather-card">
            <p className="weather-card-label">5-DAY FORECAST</p>
            <div className="weather-divider" />
            {loading
              ? <p className="weather-loading-text">Loading…</p>
              : dailyItems.map(({ day, icon, high, low }, i) => (
                <div key={day}>
                  {i > 0 && <div className="weather-day-divider" />}
                  <div className="weather-forecast-row">
                    <span className="weather-forecast-day">{day}</span>
                    <span className="weather-forecast-icon">{icon}</span>
                    <span className="weather-forecast-range">{low}° – {high}°</span>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

        <div className="weather-home-indicator" />
      </div>
    </div>
  );
}
