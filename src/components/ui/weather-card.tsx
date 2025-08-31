import { Thermometer, Droplets, CloudRain, RefreshCw, MapPin, Mountain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useWeather from "@/hooks/use-weather";

interface WeatherCardProps {
  latitude: number;
  longitude: number;
  location?: string;
}

const WeatherCard = ({ latitude, longitude, location = "Sua região" }: WeatherCardProps) => {
  const { data, loading, error, refetch } = useWeather(latitude, longitude);

  if (loading) {
    return (
      <Card className="shadow-card border-eden-blue/20 bg-eden-blue/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados climáticos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-card border-red-500/20 bg-red-500/5">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-500 mb-2">Erro ao carregar clima</p>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw size={14} className="mr-2" />
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="shadow-card border-eden-blue/20 bg-eden-blue/5">
      <CardHeader>
        <CardTitle className="font-roboto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Thermometer className="text-eden-blue" size={20} />
            Condições Climáticas
          </div>
          <Button onClick={refetch} variant="ghost" size="sm">
            <RefreshCw size={16} />
          </Button>
        </CardTitle>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin size={14} />
          <a 
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-eden-blue hover:underline transition-colors"
          >
            {location}
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Temperatura */}
          <div className="bg-white/80 rounded-lg p-3 border border-eden-blue/10">
            <div className="flex items-center gap-2 mb-1">
              <Thermometer size={16} className="text-eden-orange" />
              <span className="text-sm text-muted-foreground">Temperatura</span>
            </div>
            <p className="text-2xl font-bold">{data.temperature}°C</p>
          </div>

          {/* Umidade do Ar */}
          <div className="bg-white/80 rounded-lg p-3 border border-eden-blue/10">
            <div className="flex items-center gap-2 mb-1">
              <Droplets size={16} className="text-eden-blue" />
              <span className="text-sm text-muted-foreground">Umidade do Ar</span>
            </div>
            <p className="text-2xl font-bold">{data.humidity}%</p>
          </div>

          {/* Precipitação */}
          <div className="bg-white/80 rounded-lg p-3 border border-eden-blue/10">
            <div className="flex items-center gap-2 mb-1">
              <CloudRain size={16} className="text-eden-green" />
              <span className="text-sm text-muted-foreground">Chuva</span>
            </div>
            <p className="text-2xl font-bold">{data.precipitation} mm</p>
          </div>

          {/* Temperatura do Solo */}
          <div className="bg-white/80 rounded-lg p-3 border border-eden-blue/10">
            <div className="flex items-center gap-2 mb-1">
              <Mountain size={16} className="text-eden-brown" />
              <span className="text-sm text-muted-foreground">Temp. Solo</span>
            </div>
            <p className="text-2xl font-bold">{data.soilTemperature}°C</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
export { WeatherCard };