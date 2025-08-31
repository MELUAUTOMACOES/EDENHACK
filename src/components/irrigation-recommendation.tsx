import { Droplets, Calculator, Clock, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useWeather from "@/hooks/use-weather";

interface IrrigationRecommendationProps {
  latitude: number;
  longitude: number;
}

const IrrigationRecommendation = ({ latitude, longitude }: IrrigationRecommendationProps) => {
  const { data, loading, error, refetch } = useWeather(latitude, longitude);

  const calculateIrrigation = (soilTemp: number, airHumidity: number) => {
    // Fórmula: Irrigação (mm/dia) = (Temperatura do Solo × 0.2) + ((100 - Umidade do Ar) × 0.05)
    const irrigation = (soilTemp * 0.2) + ((100 - airHumidity) * 0.05);
    return Math.round(irrigation * 100) / 100; // Arredondar para 2 casas decimais
  };

  const getFrequencyRecommendation = (irrigationMm: number) => {
    if (irrigationMm <= 2) {
      return { times: 2, description: "2 vezes ao dia" };
    } else if (irrigationMm <= 4) {
      return { times: 3, description: "3 vezes ao dia" };
    } else {
      return { times: 3, description: "3 vezes ao dia (alta necessidade)" };
    }
  };

  if (loading) {
    return (
      <Card className="shadow-card border-eden-green/20 bg-eden-green/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground">Carregando recomendações...</p>
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
            <p className="text-red-500 mb-2">Erro ao carregar dados</p>
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

  const irrigationMm = calculateIrrigation(data.soilTemperature, data.humidity);
  const frequency = getFrequencyRecommendation(irrigationMm);

  return (
    <Card className="shadow-card border-eden-green/20 bg-eden-green/5">
      <CardHeader>
        <CardTitle className="font-roboto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="text-eden-green" size={20} />
            Recomendação de Irrigação
          </div>
          <Button onClick={refetch} variant="ghost" size="sm">
            <RefreshCw size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Cálculo Principal */}
          <div className="bg-white/80 rounded-lg p-4 border border-eden-green/20">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="text-eden-green" size={18} />
              <h3 className="font-roboto font-bold">Cálculo Baseado no Clima</h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temperatura do Solo:</span>
                <span className="font-medium">{data.soilTemperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Umidade do Ar:</span>
                <span className="font-medium">{data.humidity}%</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Irrigação Necessária:</span>
                  <span className="text-lg font-bold text-eden-green">{irrigationMm} mm/dia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Frequência Recomendada */}
          <div className="bg-white/80 rounded-lg p-4 border border-eden-blue/20">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="text-eden-blue" size={18} />
              <h3 className="font-roboto font-bold">Frequência Ideal</h3>
            </div>
            
            <div className="text-center py-2">
              <p className="text-2xl font-bold text-eden-blue">{frequency.description}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Baseado nas condições atuais
              </p>
            </div>

            <div className="mt-4 p-3 bg-eden-yellow/10 rounded-lg">
              <p className="text-sm">
                <span className="font-medium">💡 Dica:</span> Divida a irrigação em {frequency.times} aplicações 
                de aproximadamente {Math.round(irrigationMm / frequency.times * 10) / 10} mm cada.
              </p>
            </div>
          </div>

          {/* Recomendações Adicionais */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Recomendações para hoje:</h4>
            <div className="space-y-1">
              {data.humidity < 50 && (
                <div className="text-sm p-2 bg-eden-orange/10 rounded flex items-start gap-2">
                  <span>⚠️</span>
                  <span>Umidade baixa detectada. Considere aumentar a duração da irrigação.</span>
                </div>
              )}
              {data.soilTemperature > 25 && (
                <div className="text-sm p-2 bg-eden-blue/10 rounded flex items-start gap-2">
                  <span>🌡️</span>
                  <span>Solo quente. Irrigue preferencialmente no início da manhã e final da tarde.</span>
                </div>
              )}
              {data.precipitation > 0 && (
                <div className="text-sm p-2 bg-eden-green/10 rounded flex items-start gap-2">
                  <span>🌧️</span>
                  <span>Precipitação detectada. Reduza a irrigação proporcionalmente.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IrrigationRecommendation;