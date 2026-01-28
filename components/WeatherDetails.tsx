import React from 'react';
import { WeatherData } from '../types';

interface WeatherDetailsProps {
  data: WeatherData;
}

const DetailItem = ({ 
  icon, 
  label, 
  value, 
  unit, 
  subtext 
}: { 
  icon: string; 
  label: string; 
  value: string | number; 
  unit?: string; 
  subtext: React.ReactNode 
}) => (
  <div className="flex flex-col gap-1 transition-opacity hover:opacity-100 opacity-90 group">
    <div className="flex items-center gap-2 text-white/40 mb-1 group-hover:text-white/60 transition-colors">
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-lg md:text-xl font-light text-white">
      {value} <span className="text-xs md:text-sm text-white/50">{unit}</span>
    </p>
    <div className="text-[10px] md:text-xs text-white/40 min-h-[16px] flex items-center">{subtext}</div>
  </div>
);

const getWindRotation = (dir: string) => {
  const map: Record<string, number> = {
    'N': 0, 'NE': 45, 'E': 90, 'SE': 135,
    'S': 180, 'SW': 225, 'W': 270, 'NW': 315
  };
  // Wind direction is "from", so we rotate 180 degrees to show flow "to"
  const sourceDeg = map[dir] ?? 0;
  return (sourceDeg + 180) % 360; 
};

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ data }) => {
  const isMetric = data.units.speed === 'km/h';

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 w-full border-t border-white/5 pt-6 backdrop-blur-sm z-20">
      <DetailItem 
        icon="air" 
        label="Wind" 
        value={data.windSpeed} 
        unit={data.units.speed}
        subtext={
          <div className="flex items-center gap-1.5">
            <span 
              className="material-symbols-outlined text-sm transform transition-transform duration-700"
              style={{ transform: `rotate(${getWindRotation(data.windDir)}deg)` }}
            >
              navigation
            </span>
            <span>{data.windDir}</span>
          </div>
        } 
      />
      <DetailItem 
        icon="water_drop" 
        label="Humidity" 
        value={data.humidity} 
        unit="%" 
        subtext={`Dew point ${data.dewPoint}°`} 
      />
      <DetailItem 
        icon="visibility" 
        label="Visibility" 
        value={data.visibility} 
        unit={isMetric ? 'km' : 'mi'}
        subtext={data.visibility < (isMetric ? 8 : 5) ? 'Low visibility' : 'Clear view'} 
      />
      <DetailItem 
        icon="wb_sunny" 
        label="UV Index" 
        value={data.uvIndex} 
        unit={data.uvIndex < 3 ? 'Low' : data.uvIndex < 6 ? 'Mod' : 'High'} 
        subtext={data.uvIndex < 3 ? 'No protection needed' : 'Use sun protection'} 
      />
    </div>
  );
};

export default WeatherDetails;