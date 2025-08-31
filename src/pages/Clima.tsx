import { Cloud } from "lucide-react";
import WeatherCard from "@/components/ui/weather-card";
import IrrigationRecommendation from "@/components/irrigation-recommendation";

const Clima = () => {
  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-3xl font-roboto font-bold text-primary mb-2 flex items-center gap-2">
          <Cloud className="text-eden-green" />
          Clima
        </h1>
        <p className="text-muted-foreground font-lato">
          Condições climáticas para sua agricultura
        </p>
      </div>

      <div className="mb-6">
        <WeatherCard 
          latitude={-24.6525552} 
          longitude={-47.8817452} 
          location="Dunamis Farm, SP" 
        />
      </div>

      <div className="mb-6">
        <IrrigationRecommendation 
          latitude={-24.6525552} 
          longitude={-47.8817452} 
        />
      </div>
    </div>
  );
};

export default Clima;
