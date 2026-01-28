export enum WeatherCondition {
  Clear = 'Clear',
  Clouds = 'Clouds',
  Mist = 'Mist',
  Rain = 'Rain',
  Thunderstorm = 'Thunderstorm',
  Snow = 'Snow',
}

export type UnitSystem = 'imperial' | 'metric';

export interface HourlyData {
  time: string; // "Now", "2 PM", etc.
  temp: number;
  timestamp: number;
  precipChance: number;
  precipAmount: number;
  windSpeed: number;
}

export interface DailyData {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: WeatherCondition;
  description: string;
  precipSum: number;
}

export interface WeatherData {
  location: string;
  date: string;
  temp: number;
  feelsLike: number;
  condition: WeatherCondition;
  description: string;
  high: number;
  low: number;
  hourly: HourlyData[];
  daily: DailyData[];
  windSpeed: number;
  windDir: string;
  humidity: number;
  dewPoint: number;
  visibility: number;
  uvIndex: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  units: {
    temp: string;
    speed: string;
    precip: string;
  };
}