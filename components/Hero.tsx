import React from 'react';

interface HeroProps {
  temp: number;
  feelsLike: number;
  condition: string;
  high: number;
  low: number;
}

const Hero: React.FC<HeroProps> = ({ temp, feelsLike, condition, high, low }) => {
  return (
    <div className="flex flex-col items-center animate-fade-in gap-2 mt-8 md:mt-0 z-10">
      <div className="relative flex flex-col items-center">
        <h1 className="text-[8rem] md:text-[12rem] leading-none font-thin tracking-tighter text-white drop-shadow-2xl select-none">
          {Math.round(temp)}
          <span className="absolute top-4 -right-12 md:static md:top-auto md:right-auto md:align-top text-4xl md:text-6xl font-thin opacity-50">°</span>
        </h1>
        <p className="text-white/60 font-light text-lg md:text-xl tracking-wide -mt-2 md:-mt-4">
          Feels like {Math.round(feelsLike)}°
        </p>
      </div>
      
      <p className="text-2xl md:text-4xl font-light tracking-[0.2em] text-white/90 uppercase pl-3 select-none drop-shadow-lg mt-2">
        {condition}
      </p>

      <div className="mt-6 flex items-center gap-6 text-lg font-light text-white/60 select-none">
        <span className="flex items-center gap-1 transition-transform hover:scale-105">
          <span className="material-symbols-outlined text-sm">arrow_downward</span> {Math.round(low)}°
        </span>
        <span className="h-1 w-1 rounded-full bg-white/40"></span>
        <span className="flex items-center gap-1 transition-transform hover:scale-105">
          <span className="material-symbols-outlined text-sm">arrow_upward</span> {Math.round(high)}°
        </span>
      </div>
    </div>
  );
};

export default Hero;