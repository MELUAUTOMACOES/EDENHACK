import { Sun, Cloud, CloudRain, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherCardProps {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy";
  humidity: number;
  windSpeed: number;
  location: string;
}

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
};

const weatherColors = {
  sunny: "text-eden-yellow",
  cloudy: "text-muted-foreground",
  rainy: "text-eden-blue",
};

export function WeatherCard({ temperature, condition, humidity, windSpeed, location }: WeatherCardProps) {
  const Icon = weatherIcons[condition];
  const iconColor = weatherColors[condition];

  return (
    <Card className="shadow-card bg-gradient-to-br from-background to-secondary/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Icon size={32} className={iconColor} />
            <div>
              <p className="text-2xl font-roboto font-bold">{temperature}°C</p>
              <p className="text-sm text-muted-foreground font-lato">{location}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-eden-blue"></div>
            <span className="text-sm font-lato">Umidade: {humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind size={14} className="text-muted-foreground" />
            <span className="text-sm font-lato">Vento: {windSpeed} km/h</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}