import { Droplets, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface IrrigationStatusProps {
  isActive: boolean;
  mode: "manual" | "automatic";
  nextScheduled?: string;
  moistureLevel: number;
}

export function IrrigationStatus({ isActive, mode, nextScheduled, moistureLevel }: IrrigationStatusProps) {
  const getMoistureColor = (level: number) => {
    if (level >= 70) return "text-eden-blue";
    if (level >= 40) return "text-eden-yellow";
    return "text-eden-orange";
  };

  const getMoistureBackground = (level: number) => {
    if (level >= 70) return "bg-eden-blue";
    if (level >= 40) return "bg-eden-yellow";
    return "bg-eden-orange";
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-roboto">
          <Droplets className="text-eden-blue" size={20} />
          Status da Irrigação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-eden-green animate-pulse' : 'bg-muted'}`}></div>
            <span className="font-lato font-medium">
              {isActive ? "Irrigando" : "Parado"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {mode === "automatic" ? (
              <Zap size={16} className="text-eden-blue" />
            ) : (
              <Clock size={16} className="text-muted-foreground" />
            )}
            <span className="text-sm font-lato capitalize">{mode}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-lato">Umidade do Solo</span>
            <span className={`font-roboto font-bold ${getMoistureColor(moistureLevel)}`}>
              {moistureLevel}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getMoistureBackground(moistureLevel)}`}
              style={{ width: `${moistureLevel}%` }}
            ></div>
          </div>
        </div>

        {nextScheduled && !isActive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock size={14} />
            <span className="font-lato">Próxima irrigação: {nextScheduled}</span>
          </div>
        )}

        <Button 
          size="sm" 
          variant={isActive ? "destructive" : "default"}
          className="w-full font-lato font-medium"
        >
          {isActive ? "Parar Irrigação" : "Iniciar Irrigação"}
        </Button>
      </CardContent>
    </Card>
  );
}