import { WeatherCondition, WeatherData, HourlyData, DailyData, UnitSystem } from '../types';

// Helper for mapping WMO codes to our enum and description
const mapWeatherCode = (code: number, isDay: number): { condition: WeatherCondition; description: string } => {
  if (code === 0) return { condition: WeatherCondition.Clear, description: isDay ? 'Sunny' : 'Clear' };
  if (code <= 3) return { condition: WeatherCondition.Clouds, description: 'Cloudy' };
  if (code === 45 || code === 48) return { condition: WeatherCondition.Mist, description: 'Fog' };
  if (code >= 51 && code <= 57) return { condition: WeatherCondition.Rain, description: 'Drizzle' };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { condition: WeatherCondition.Rain, description: 'Rain' };
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { condition: WeatherCondition.Snow, description: 'Snow' };
  if (code >= 95) return { condition: WeatherCondition.Thunderstorm, description: 'Storm' };
  return { condition: WeatherCondition.Clear, description: 'Clear' };
};

const degreesToCardinal = (deg: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

interface GeoResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country?: string;
    admin1?: string;
  }>;
}

const getCoordinates = async (city: string) => {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  if (!response.ok) throw new Error('Geocoding failed');
  const data: GeoResponse = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found');
  }
  return data.results[0];
};

const getWeatherData = async (lat: number, lon: number, locationName: string, unit: UnitSystem): Promise<WeatherData> => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,is_day,dew_point_2m,visibility,cloud_cover,precipitation',
    hourly: 'temperature_2m,weather_code,precipitation_probability,precipitation,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum',
    wind_speed_unit: unit === 'imperial' ? 'mph' : 'kmh',
    temperature_unit: unit === 'imperial' ? 'fahrenheit' : 'celsius',
    precipitation_unit: unit === 'imperial' ? 'inch' : 'mm',
    timeformat: 'unixtime',
    timezone: 'auto'
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) throw new Error('Weather data fetch failed');
  
  const data = await response.json();
  
  const current = data.current;
  const daily = data.daily;
  const hourly = data.hourly;
  
  const { condition, description } = mapWeatherCode(current.weather_code, current.is_day);

  // Process hourly data
  const currentTimestamp = current.time;
  let startIndex = 0;
  for(let i=0; i<hourly.time.length; i++) {
      if (hourly.time[i] >= currentTimestamp) {
          startIndex = i;
          break;
      }
  }
  
  const relevantHourly: HourlyData[] = [];
  for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
    const timestamp = hourly.time[i];
    const date = new Date(timestamp * 1000);
    
    let timeLabel = '';
    if (i === startIndex) {
        timeLabel = 'NOW';
    } else {
        const hours = date.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;
        timeLabel = `${h12} ${ampm}`;
    }

    relevantHourly.push({
      time: timeLabel,
      temp: Math.round(hourly.temperature_2m[i]),
      timestamp: timestamp,
      precipChance: hourly.precipitation_probability[i] || 0,
      precipAmount: hourly.precipitation[i] || 0,
      windSpeed: Math.round(hourly.wind_speed_10m[i]),
    });
  }

  // Process Daily data (next 5 days)
  const relevantDaily: DailyData[] = [];
  for (let i = 0; i < 5; i++) {
    const timestamp = daily.time[i];
    const date = new Date(timestamp * 1000);
    const dayName = i === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const { condition: dailyCond, description: dailyDesc } = mapWeatherCode(daily.weather_code[i], 1);

    relevantDaily.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      dayName,
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
      condition: dailyCond,
      description: dailyDesc,
      precipSum: daily.precipitation_sum[i] || 0,
    });
  }

  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // Handle Visibility: API is meters
  const visibilityVal = unit === 'imperial' 
    ? parseFloat((current.visibility / 1609.34).toFixed(1)) 
    : parseFloat((current.visibility / 1000).toFixed(1));

  const uvIndex = daily.uv_index_max && daily.uv_index_max.length > 0 ? Math.round(daily.uv_index_max[0]) : 0;

  return {
    location: locationName,
    date: dateString,
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    condition,
    description: description.toUpperCase(),
    high: Math.round(daily.temperature_2m_max[0]),
    low: Math.round(daily.temperature_2m_min[0]),
    hourly: relevantHourly,
    daily: relevantDaily,
    windSpeed: Math.round(current.wind_speed_10m),
    windDir: degreesToCardinal(current.wind_direction_10m),
    humidity: Math.round(current.relative_humidity_2m),
    dewPoint: Math.round(current.dew_point_2m),
    visibility: visibilityVal,
    uvIndex: uvIndex,
    pressure: Math.round(current.surface_pressure),
    cloudCover: current.cloud_cover,
    precipitation: current.precipitation,
    units: {
      temp: unit === 'imperial' ? '°F' : '°C',
      speed: unit === 'imperial' ? 'mph' : 'km/h',
      precip: unit === 'imperial' ? '"' : 'mm',
    }
  };
};

export const fetchWeather = async (city: string, unit: UnitSystem = 'imperial'): Promise<WeatherData> => {
  const geo = await getCoordinates(city);
  let locationLabel = geo.name;
  if (geo.admin1) locationLabel += `, ${geo.admin1}`;
  else if (geo.country) locationLabel += `, ${geo.country}`;
  
  return getWeatherData(geo.latitude, geo.longitude, locationLabel, unit);
};

export const fetchCurrentLocationWeather = async (unit: UnitSystem = 'imperial'): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await getWeatherData(position.coords.latitude, position.coords.longitude, "My Location", unit);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
};