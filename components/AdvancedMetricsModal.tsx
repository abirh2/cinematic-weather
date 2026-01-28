import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList
} from 'recharts';
import { WeatherData, WeatherCondition } from '../types';

interface AdvancedMetricsModalProps {
  data: WeatherData;
  isOpen: boolean;
  onClose: () => void;
}

const CustomTooltip = ({ active, payload, label, mode, unit }: any) => {
  if (active && payload && payload.length) {
    const isChance = mode === 'chance';
    return (
      <div className="bg-[#101922]/90 backdrop-blur-md border border-white/10 p-3 rounded shadow-xl text-xs">
        <p className="text-white font-semibold mb-1">{label}</p>
        <p className="text-blue-300">
          {isChance ? 'Probability: ' : 'Amount: '}
          {payload[0].value}{isChance ? '%' : ` ${unit}`}
        </p>
      </div>
    );
  }
  return null;
};

const CustomBarLabel = (props: any) => {
  const { x, y, width, value, mode } = props;
  if (mode === 'chance' && value > 70) {
    return (
      <text
        x={x + width / 2}
        y={y - 10}
        fill="#60a5fa"
        textAnchor="middle"
        style={{
          fontFamily: "'Material Symbols Outlined'",
          fontSize: '16px',
        }}
      >
        water_drop
      </text>
    );
  }
  return null;
};

const ConditionIcon = ({ condition, className = "text-xl" }: { condition: WeatherCondition, className?: string }) => {
  const map = {
    [WeatherCondition.Clear]: 'wb_sunny',
    [WeatherCondition.Clouds]: 'cloud',
    [WeatherCondition.Mist]: 'foggy',
    [WeatherCondition.Rain]: 'rainy',
    [WeatherCondition.Thunderstorm]: 'thunderstorm',
    [WeatherCondition.Snow]: 'ac_unit',
  };
  return <span className={`material-symbols-outlined ${className}`}>{map[condition]}</span>;
};

const AdvancedMetricsModal: React.FC<AdvancedMetricsModalProps> = ({ data, isOpen, onClose }) => {
  const [precipMode, setPrecipMode] = useState<'chance' | 'amount'>('chance');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#1a1f26]/80 border border-white/10 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5 shrink-0">
          <div>
            <h2 className="text-xl font-medium text-white tracking-wide">Detailed Metrics</h2>
            <p className="text-xs text-white/40 uppercase tracking-widest mt-1">{data.location}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="overflow-y-auto p-6 no-scrollbar flex-1">
          
          {/* Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <span className="material-symbols-outlined text-lg">water_drop</span>
                <span className="text-xs font-bold uppercase tracking-wider">Precipitation</span>
              </div>
              <p className="text-2xl text-white font-light">{data.precipitation} <span className="text-sm text-white/40">{data.units.precip}</span></p>
              <p className="text-xs text-white/40 mt-1">Accumulation (current)</p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <span className="material-symbols-outlined text-lg">compress</span>
                <span className="text-xs font-bold uppercase tracking-wider">Pressure</span>
              </div>
              <p className="text-2xl text-white font-light">{data.pressure} <span className="text-sm text-white/40">hPa</span></p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <span className="material-symbols-outlined text-lg">cloud</span>
                <span className="text-xs font-bold uppercase tracking-wider">Cloud Cover</span>
              </div>
              <p className="text-2xl text-white font-light">{data.cloudCover} <span className="text-sm text-white/40">%</span></p>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-white/50 mb-2">
                <span className="material-symbols-outlined text-lg">thermostat</span>
                <span className="text-xs font-bold uppercase tracking-wider">Dew Point</span>
              </div>
              <p className="text-2xl text-white font-light">{data.dewPoint} <span className="text-sm text-white/40">°</span></p>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white/80 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">calendar_month</span>
              5-Day Outlook
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {data.daily.map((day, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col items-center gap-2 group hover:bg-white/10 transition-colors">
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">{day.dayName}</p>
                  <p className="text-[10px] text-white/20 mb-1">{day.date}</p>
                  <ConditionIcon condition={day.condition} className="text-2xl text-white/80 group-hover:text-white transition-colors" />
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium text-white">{day.tempMax}°</span>
                    <span className="text-xs text-white/30">{day.tempMin}°</span>
                  </div>
                  {day.precipSum > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                       <span className="material-symbols-outlined text-[10px] text-blue-400">water_drop</span>
                       <span className="text-[10px] text-blue-300">{day.precipSum}{data.units.precip}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Precipitation Insights Consolidated Chart Section */}
          <div className="bg-white/5 rounded-xl border border-white/5 p-4 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-white/80 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">{precipMode === 'chance' ? 'rainy' : 'water_drop'}</span>
                Precipitation {precipMode === 'chance' ? 'Probability' : 'Amount'}
              </h3>
              
              <div className="flex bg-black/30 p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setPrecipMode('chance')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${precipMode === 'chance' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                  Chance
                </button>
                <button 
                  onClick={() => setPrecipMode('amount')}
                  className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md transition-all ${precipMode === 'amount' ? 'bg-blue-600 text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                >
                  Amount
                </button>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.hourly} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    interval={3}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    domain={precipMode === 'chance' ? [0, 100] : [0, 'auto']}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                    content={<CustomTooltip mode={precipMode} unit={data.units.precip} />} 
                  />
                  <Bar 
                    dataKey={precipMode === 'chance' ? 'precipChance' : 'precipAmount'} 
                    radius={[2, 2, 0, 0]} 
                    fillOpacity={0.8}
                    barSize={12}
                  >
                    {data.hourly.map((entry, index) => {
                       const value = precipMode === 'chance' ? entry.precipChance : entry.precipAmount;
                       const highlight = precipMode === 'chance' ? value > 70 : value > 0;
                       return <Cell key={`cell-${index}`} fill={highlight ? '#60a5fa' : '#3b82f6'} />;
                    })}
                    <LabelList dataKey={precipMode === 'chance' ? 'precipChance' : 'precipAmount'} content={<CustomBarLabel mode={precipMode} />} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hourly Forecast Table */}
          <div className="bg-white/5 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-white/5">
               <h3 className="text-sm font-medium text-white/80">Hourly Forecast Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="text-xs uppercase text-white/40 bg-white/5">
                  <tr>
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-6 py-3 font-medium">Temp</th>
                    <th className="px-6 py-3 font-medium">Precipitation</th>
                    <th className="px-6 py-3 font-medium">Wind</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.hourly.map((hour, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{hour.time}</td>
                      <td className="px-6 py-4">{hour.temp}°</td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-500 rounded-full" 
                                    style={{ width: `${hour.precipChance}%` }}
                                />
                                </div>
                                <span className="text-xs w-8">{hour.precipChance}%</span>
                            </div>
                            {hour.precipAmount > 0 && (
                                <span className="text-[10px] text-white/40">
                                    {hour.precipAmount} {data.units.precip}
                                </span>
                            )}
                         </div>
                      </td>
                      <td className="px-6 py-4">{hour.windSpeed} <span className="text-xs opacity-50">{data.units.speed}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdvancedMetricsModal;