import React, { useState } from 'react';
import { UnitSystem } from '../types';

interface HeaderProps {
  location: string;
  date: string;
  unit: UnitSystem;
  onSearch: (city: string) => void;
  onCurrentLocation?: () => void;
  onToggleUnit: (u: UnitSystem) => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  location, 
  date, 
  unit,
  onSearch, 
  onCurrentLocation, 
  onToggleUnit,
  onMenuClick
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      setSearchValue('');
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  return (
    <header className="flex w-full items-start justify-between z-20 relative">
      <div className="flex flex-col gap-1 animate-fade-in">
        <div className="flex items-center gap-2 text-white/90">
          <button 
            onClick={onCurrentLocation}
            className="flex items-center gap-2 hover:text-accent transition-colors duration-300 focus:outline-none"
            title="Use current location"
          >
            <span className="material-symbols-outlined text-xl drop-shadow-sm">near_me</span>
            <h2 className="text-lg font-medium tracking-wide drop-shadow-md">{location}</h2>
          </button>
        </div>
        <p className="text-sm font-light text-white/50 pl-7">{date}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Unit Toggle */}
        <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => onToggleUnit('imperial')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${unit === 'imperial' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}`}
          >
            °F
          </button>
          <button 
            onClick={() => onToggleUnit('metric')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-300 ${unit === 'metric' ? 'bg-white text-black shadow-md' : 'text-white/60 hover:text-white'}`}
          >
            °C
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative group hidden md:block">
          <label className="relative flex items-center">
            <span className={`material-symbols-outlined absolute left-0 transition-colors duration-300 ${isFocused ? 'text-accent' : 'text-white/50'}`}>
              search
            </span>
            <input
              type="text"
              className="bg-transparent border-b border-white/20 py-2 pl-8 pr-4 text-sm font-light text-white placeholder-white/30 focus:border-accent focus:outline-none focus:ring-0 w-32 focus:w-64 transition-all duration-500 ease-out"
              placeholder="Search city..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </label>
        </form>

        <button 
          onClick={onMenuClick}
          className="flex items-center justify-center rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors duration-300"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
      </div>
    </header>
  );
};

export default Header;