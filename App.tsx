import { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ForecastChart from './components/ForecastChart';
import WeatherDetails from './components/WeatherDetails';
import Background from './components/Background';
import AdvancedMetricsModal from './components/AdvancedMetricsModal';
import { fetchWeather, fetchCurrentLocationWeather } from './services/weatherService';
import { WeatherData, UnitSystem } from './types';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<UnitSystem>('imperial');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [lastCity, setLastCity] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    loadCurrentLocation();
  }, []);

  // Auto-dismiss error toast
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadCity = useCallback(async (city: string, unitSystem: UnitSystem) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city, unitSystem);
      setWeather(data);
      // Store the search query (city) rather than the formatted data.location
      // to ensure subsequent fetches (like unit toggles) work reliably with the Geocoding API.
      setLastCity(city); 
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Could not fetch weather data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCurrentLocation = useCallback(async (unitSystem: UnitSystem = unit) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCurrentLocationWeather(unitSystem);
      setWeather(data);
      setLastCity(null); // Indicates we are using GPS
      setLoading(false);
    } catch (err) {
      console.warn("Geolocation failed or denied, falling back to default city.", err);
      // Fallback to San Francisco if GPS fails
      loadCity('San Francisco', unitSystem);
    }
  }, [unit, loadCity]);

  const handleSearch = (city: string) => {
    loadCity(city, unit);
  };

  const handleToggleUnit = (newUnit: UnitSystem) => {
    if (newUnit === unit) return;
    setUnit(newUnit);
    
    // Refresh data with new unit
    if (lastCity) {
      // Use the stored raw query which is known to be valid
      loadCity(lastCity, newUnit);
    } else {
      loadCurrentLocation(newUnit);
    }
  };

  if (!weather && loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#101922] text-white">
         <div className="flex flex-col items-center gap-4">
             <span className="material-symbols-outlined text-4xl animate-spin text-accent">progress_activity</span>
             <p className="font-light text-white/50 tracking-widest text-sm">LOADING WEATHER</p>
         </div>
      </div>
    );
  }

  // Fallback if initial load fails completely
  if (!weather) {
     return (
       <div className="h-screen w-full flex flex-col items-center justify-center bg-[#101922] text-white p-4">
         <span className="material-symbols-outlined text-4xl text-red-400 mb-4">error_outline</span>
         <p className="mb-2 text-lg font-light">Unable to retrieve weather info.</p>
         {error && <p className="mb-6 text-white/50 text-sm bg-white/5 px-4 py-2 rounded">{error}</p>}
         <button 
           onClick={() => loadCity('San Francisco', 'imperial')} 
           className="px-6 py-2 bg-accent hover:bg-accent/80 rounded-full text-sm font-medium transition-colors"
         >
           Retry Default
         </button>
       </div>
     );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden font-display flex flex-col justify-between selection:bg-accent/30 selection:text-white">
      
      {/* Dynamic Background Layer */}
      <Background condition={weather.condition} />

      {/* Advanced Metrics Modal */}
      <AdvancedMetricsModal 
        data={weather} 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      {/* Error Toast Notification */}
      {error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in w-max max-w-[90%]">
          <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400">warning</span>
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="hover:text-white/80 transition-colors">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className={`relative z-10 flex h-full w-full flex-col justify-between p-6 md:p-12 lg:px-24 overflow-y-auto no-scrollbar md:overflow-hidden transition-all duration-500 ${isMenuOpen ? 'scale-95 opacity-50 blur-[2px]' : ''}`}>
        
        {/* Top Section */}
        <Header 
          location={weather.location} 
          date={weather.date} 
          unit={unit}
          onSearch={handleSearch}
          onCurrentLocation={() => loadCurrentLocation(unit)}
          onToggleUnit={handleToggleUnit}
          onMenuClick={() => setIsMenuOpen(true)}
        />

        {/* Loading Overlay for Search/Toggle Transitions */}
        {loading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-[2px] rounded-lg animate-fade-in">
                 <span className="material-symbols-outlined text-4xl animate-spin text-white/80">progress_activity</span>
            </div>
        )}

        {/* Middle Section */}
        <main className={`flex-1 flex flex-col items-center justify-center transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
          <Hero 
            temp={weather.temp} 
            feelsLike={weather.feelsLike}
            condition={weather.description} 
            high={weather.high} 
            low={weather.low} 
          />
        </main>

        {/* Bottom Section */}
        <footer className={`flex w-full flex-col gap-8 pb-4 transition-transform duration-500 ${loading ? 'translate-y-4 opacity-50' : 'translate-y-0 opacity-100'}`}>
          <ForecastChart data={weather.hourly} />
          <WeatherDetails data={weather} />
        </footer>
      </div>
    </div>
  );
}

export default App;