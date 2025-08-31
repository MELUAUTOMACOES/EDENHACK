import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  soilTemperature: number;
}

export interface WeatherError {
  message: string;
  code?: string;
}

interface UseWeatherReturn {
  data: WeatherData | null;
  loading: boolean;
  error: WeatherError | null;
  refetch: () => void;
}

const useWeather = (latitude: number, longitude: number): UseWeatherReturn => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<WeatherError | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,soil_temperature_0cm,soil_temperature_6cm&timezone=America/Sao_Paulo`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const result = await response.json();
      
      // Calcular temperatura do solo representativa para 0-10cm
      const soilTemp0cm = result.current.soil_temperature_0cm;
      const soilTemp6cm = result.current.soil_temperature_6cm;
      const representativeSoilTemp = Math.round((soilTemp0cm * 0.7 + soilTemp6cm * 0.3) * 10) / 10;
      
      const weatherData: WeatherData = {
        temperature: Math.round(result.current.temperature_2m),
        humidity: Math.round(result.current.relative_humidity_2m),
        precipitation: result.current.precipitation || 0,
        soilTemperature: representativeSoilTemp
      };

      setData(weatherData);
    } catch (err) {
      setError({
        message: err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados do clima',
        code: 'FETCH_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather();
    }
  }, [latitude, longitude]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeather
  };
};

export default useWeather;
