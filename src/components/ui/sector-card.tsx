import { Edit, Droplets, Square, Calendar, Zap, ChevronDown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface SectorCardProps {
  id: string;
  title: string;
  product: string;
  repetitionInterval: string;
  isIrrigating: boolean;
  isAutomatic: boolean;
  harvestStatus: "seeded" | "growing" | "ready" | "harvested" | "paused";
  harvestForecast: Date;
  plantingDate?: Date;
  amount?: number;
  remainingTime?: number;
  sensors?: number[];
  plantedSeedlings?: number;
  harvestedSeedlings?: number;
  onEdit: (id: string) => void;
  onIrrigate: (id: string) => void;
  onStop: (id: string) => void;
  onView: (id: string) => void;
  onToggleAutomatic: (id: string) => void;
  onHarvestStatusChange: (id: string, status: "seeded" | "growing" | "ready" | "harvested" | "paused") => void;
}

export function SectorCard({
  id,
  title,
  product,
  repetitionInterval,
  isIrrigating,
  isAutomatic,
  harvestStatus,
  harvestForecast,
  plantingDate,
  amount = 250,
  remainingTime,
  sensors = [],
  plantedSeedlings = 0,
  harvestedSeedlings = 0,
  onEdit,
  onIrrigate,
  onStop,
  onView,
  onToggleAutomatic,
  onHarvestStatusChange,
}: SectorCardProps) {
  const getHarvestStatusConfig = () => {
    switch (harvestStatus) {
      case "seeded":
        return { icon: "🌰", label: "Semeado", color: "bg-amber-600" };
      case "growing":
        return { icon: "🌱", label: "Crescimento", color: "bg-green-500" };
      case "ready":
        return { icon: "✅", label: "Pronto para colher", color: "bg-blue-500" };
      case "harvested":
        return { icon: "🧺", label: "Colhido", color: "bg-gray-500" };
      case "paused":
        return { icon: "⏸️", label: "Pausado", color: "bg-orange-500" };
      default:
        return { icon: "🌰", label: "Semeado", color: "bg-amber-600" };
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const statusConfig = getHarvestStatusConfig();
  
  const harvestStatusOptions = [
    { value: "seeded" as const, icon: "🌰", label: "Semeado", color: "bg-amber-600" },
    { value: "growing" as const, icon: "🌱", label: "Crescimento", color: "bg-green-500" },
    { value: "ready" as const, icon: "✅", label: "Pronto para colher", color: "bg-blue-500" },
    { value: "harvested" as const, icon: "🧺", label: "Colhido", color: "bg-gray-500" },
    { value: "paused" as const, icon: "⏸️", label: "Pausado", color: "bg-orange-500" },
  ];

  return (
    <Card className="shadow-card">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div 
              className="flex-1 cursor-pointer hover:bg-secondary/20 rounded-lg p-2 -m-2 transition-colors"
              onClick={() => onView(id)}
            >
              <h3 className="font-roboto font-bold text-2xl mb-3">{title}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <span>🌱</span>
                  <span className="font-lato truncate">Produto: {product}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <span>⏱️</span>
                  <span className="font-lato truncate">Próxima: {repetitionInterval}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <Calendar size={16} />
                  <span className="font-lato truncate">Colheita: {format(harvestForecast, "dd/MM")}</span>
                </div>
                {plantingDate && (
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <span>🌰</span>
                    <span className="font-lato truncate">Plantio: {format(plantingDate, "dd/MM")}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-base text-muted-foreground">
                  <span>💧</span>
                  <span className="font-lato truncate">Quantidade: {amount}ml</span>
                </div>
                {sensors.length > 0 && (
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <span>📡</span>
                    <span className="font-lato truncate">Sensores: {sensors.join(", ")}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <span>🌱</span>
                    <span className="font-lato truncate">Plantadas: {plantedSeedlings}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base text-muted-foreground">
                    <span>🧺</span>
                    <span className="font-lato truncate">Colhidas: {harvestedSeedlings}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={`px-2 sm:px-4 py-2 rounded-full text-white text-xs sm:text-sm font-bold flex items-center gap-1 sm:gap-2 ${statusConfig.color} hover:opacity-80 transition-opacity max-w-[140px] sm:max-w-none`}
                  >
                    <span>{statusConfig.icon}</span>
                    <span className="truncate">{statusConfig.label}</span>
                    <ChevronDown size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0 bg-background border shadow-lg z-50" align="end">
                  <div className="py-1">
                    {harvestStatusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => onHarvestStatusChange(id, option.value)}
                        className="w-full px-3 py-2 text-left hover:bg-secondary flex items-center gap-2 text-sm"
                      >
                        <span className={`w-3 h-3 rounded-full ${option.color}`}></span>
                        <span>{option.icon}</span>
                        <span className="flex-1">{option.label}</span>
                        {harvestStatus === option.value && <Check size={14} className="text-primary" />}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Automatic Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-eden-blue" />
              <span className="font-lato font-medium text-base">Modo Automático</span>
            </div>
            <Switch
              checked={isAutomatic}
              onCheckedChange={() => {
                onToggleAutomatic(id);
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <Button
              size="lg"
              variant="warning"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(id);
              }}
              className="h-20 flex-col gap-1 justify-center items-center"
            >
              <Edit size={24} />
              <span className="text-sm font-medium">Editar</span>
            </Button>
            <Button
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                onIrrigate(id);
              }}
              disabled={isIrrigating || isAutomatic}
              className="h-20 flex-col gap-1 justify-center items-center bg-eden-blue hover:bg-eden-blue/90 text-white disabled:opacity-50"
            >
              <Droplets size={24} />
              {isIrrigating && remainingTime ? (
                <span className="text-sm font-medium">{formatTime(remainingTime)}</span>
              ) : (
                <span className="text-sm font-medium">Irrigar</span>
              )}
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation();
                onStop(id);
              }}
              disabled={!isIrrigating || isAutomatic}
              className="h-20 flex-col gap-1 justify-center items-center disabled:opacity-50"
            >
              <Square size={24} />
              <span className="text-sm font-medium">Parar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}