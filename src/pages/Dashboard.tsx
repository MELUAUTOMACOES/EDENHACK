import { useState } from "react";
import { Sun, Droplets, MessageCircle, GraduationCap, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [moistureLevel] = useState(45);
  const { speak } = useSpeech();

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-roboto font-bold text-primary mb-2">
          Olá, Agricultor! 🌱
        </h1>
        <p className="text-muted-foreground font-lato">
          Resumo da sua fazenda hoje
        </p>
      </div>

      {/* Weather Summary */}
      <Card className="mb-6 shadow-card bg-gradient-water text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-roboto font-bold">Hoje</h3>
              <p className="text-sm opacity-90">28°C - Ensolarado</p>
              <p className="text-xs opacity-80">Umidade: 65% | Vento: 12km/h</p>
            </div>
            <Sun size={48} className="text-eden-yellow" />
          </div>
        </CardContent>
      </Card>

      {/* Irrigation Status */}
      <Card className="mb-6 shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-eden-blue/20 rounded-full flex items-center justify-center">
                <Droplets className="text-eden-blue" size={24} />
              </div>
              <div>
                <h3 className="font-roboto font-bold">Sistema Parado</h3>
                <p className="text-sm text-muted-foreground">Umidade: {moistureLevel}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Próxima:</p>
              <p className="font-roboto font-bold">18:00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-roboto font-bold text-primary">Acessos Rápidos</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/irrigacao">
            <Button 
              className="w-full h-24 bg-gradient-water border-0 text-white flex-col gap-2"
              onClick={() => speak("Abrindo controle de irrigação")}
            >
              <Droplets size={32} />
              <span className="font-roboto font-bold">Irrigação</span>
            </Button>
          </Link>
          <Link to="/aprender">
            <Button 
              className="w-full h-24 bg-gradient-earth border-0 text-white flex-col gap-2"
              onClick={() => speak("Abrindo área de aprendizado")}
            >
              <GraduationCap size={32} />
              <span className="font-roboto font-bold">Aprender</span>
            </Button>
          </Link>
          <Link to="/chat">
            <Button 
              className="w-full h-24 bg-gradient-sunset border-0 text-white flex-col gap-2"
              onClick={() => speak("Abrindo chat com inteligência artificial")}
            >
              <MessageCircle size={32} />
              <span className="font-roboto font-bold">Adan AI</span>
            </Button>
          </Link>
          <Link to="/perfil">
            <Button 
              className="w-full h-24 bg-gradient-primary border-0 text-white flex-col gap-2"
              onClick={() => speak("Abrindo perfil e configurações")}
            >
              <Settings size={32} />
              <span className="font-roboto font-bold">Perfil</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;