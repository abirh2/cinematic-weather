import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { HourlyData } from '../types';

interface ForecastChartProps {
  data: HourlyData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded shadow-lg">
        <p className="text-white text-sm font-medium">{`${payload[0].value}°`}</p>
      </div>
    );
  }
  return null;
};

const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  // We only want to show labels for roughly 2-hour intervals to match mockup
  // Filter logic for labels is handled by the tick formatter or interval props in Recharts, 
  // but to match mockup strictly we might just want specific points.
  // The mockup shows: NOW, 2 PM, 4 PM, 6 PM, 8 PM, 10 PM.
  
  return (
    <div className="w-full z-20">
      <div className="flex items-baseline justify-between px-2 mb-2">
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-white/40">24h Forecast</p>
      </div>
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }} />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500, style: { textTransform: 'uppercase' } }}
              interval={1} // Skip every other label to reduce clutter
              dy={10}
            />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#ffffff"
              strokeOpacity={0.6}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTemp)"
              animationDuration={1500}
            />
            {/* 
              In a real scenario, we might add a specific Dot for "Now", 
              but Recharts ActiveDot handles hover. 
              To force a dot at the start, we'd customize the Dot component.
              For this mockup, the clean line is sufficient.
             */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;