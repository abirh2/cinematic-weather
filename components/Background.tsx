import React, { useMemo } from 'react';
import { WeatherCondition } from '../types';

interface BackgroundProps {
  condition: WeatherCondition;
}

// --- Particle Effects Components ---

const RainEffect = () => {
  const drops = useMemo(() => [...Array(80)].map(() => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${0.5 + Math.random() * 0.5}s`,
    animationDelay: `-${Math.random() * 2}s`,
    opacity: 0.3 + Math.random() * 0.5
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {drops.map((style, i) => (
        <div key={i} className="rain-drop" style={style} />
      ))}
    </div>
  );
};

const SnowEffect = () => {
  const flakes = useMemo(() => [...Array(50)].map(() => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${4 + Math.random() * 6}s`,
    animationDelay: `-${Math.random() * 5}s`,
    opacity: Math.random() * 0.6 + 0.2,
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {flakes.map((style, i) => (
        <div key={i} className="snowflake" style={style} />
      ))}
    </div>
  );
};

const ThunderEffect = () => (
  <div 
    className="absolute inset-0 bg-white pointer-events-none z-20 thunder-flash mix-blend-overlay"
    style={{ animationDelay: `${Math.random() * 5}s` }}
  />
);

const SunEffect = () => (
  <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] pointer-events-none z-10 sun-spot mix-blend-screen opacity-60 rounded-full blur-3xl" />
);

const CloudEffect = () => (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
        <div className="absolute top-0 left-[-20%] w-[140%] h-full cloud-layer bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl" />
    </div>
)

const Background: React.FC<BackgroundProps> = ({ condition }) => {
  // Configuration for each weather type
  const config = useMemo(() => {
    switch (condition) {
      case WeatherCondition.Clear:
        return {
          // Sunny / Clear field
          image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=85&w=2000&auto=format&fit=crop',
          gradient: 'bg-gradient-to-b from-blue-400/20 via-blue-500/10 to-blue-900/60',
          Effect: SunEffect
        };
      case WeatherCondition.Rain:
        return {
          // Dark moody rain
          image: 'https://images.unsplash.com/photo-1428592953211-07510f563853?q=85&w=2000&auto=format&fit=crop',
          gradient: 'bg-gradient-to-b from-slate-900/50 via-slate-800/40 to-slate-950/90',
          Effect: RainEffect
        };
      case WeatherCondition.Thunderstorm:
        return {
          // Lightning storm
          image: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=85&w=2000&auto=format&fit=crop',
          gradient: 'bg-gradient-to-b from-indigo-950/60 via-slate-900/50 to-black/90',
          Effect: () => <><RainEffect /><ThunderEffect /></>
        };
      case WeatherCondition.Snow:
        return {
          // Snowy forest
          image: 'https://images.unsplash.com/photo-1477601263568-180e2c6d046e?q=85&w=2000&auto=format&fit=crop',
          gradient: 'bg-gradient-to-b from-slate-200/10 via-slate-400/10 to-slate-900/60',
          Effect: SnowEffect
        };
      case WeatherCondition.Clouds:
        return {
          // Dramatic clouds
          image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=85&w=2000&auto=format&fit=crop',
          gradient: 'bg-gradient-to-b from-gray-600/30 via-gray-700/20 to-gray-900/80',
          Effect: CloudEffect
        };
      case WeatherCondition.Mist:
      default:
        return {
          // Foggy mountains
          image: 'https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=85&w=2000&auto=format&fit=crop',
          gradient: 'bg-gradient-to-b from-gray-500/20 via-gray-600/20 to-gray-900/80',
          Effect: CloudEffect
        };
    }
  }, [condition]);

  const { image, gradient, Effect } = config;

  return (
    <div className="fixed inset-0 z-0 transition-all duration-1000 ease-in-out bg-black">
      
      {/* Dynamic Background Image with Ken Burns effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div key={image} className="absolute inset-0 animate-fade-in">
             <img
                src={image}
                alt={condition}
                className="h-full w-full object-cover opacity-70 bg-ken-burns"
            />
        </div>
      </div>

      {/* Particle/Weather Effects Layer */}
      <div key={`effect-${condition}`} className="absolute inset-0 animate-fade-in">
        <Effect />
      </div>

      {/* Cinematic Gradient Overlay (Static) */}
      <div className={`absolute inset-0 ${gradient} backdrop-blur-[0px] transition-all duration-1000`} />
      
      {/* Vignette Overlay for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
    </div>
  );
};

export default Background;