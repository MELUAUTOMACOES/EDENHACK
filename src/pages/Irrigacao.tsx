import { useState, useEffect } from "react";
import { Droplets, Zap, Clock, History, AlertTriangle, Play, Square, Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSpeech } from "@/hooks/use-speech";
import { useSectors, type Sector, type HarvestStatus } from "@/hooks/use-sectors";
import { SectorCard } from "@/components/ui/sector-card";
import { SectorModal, type SectorFormData } from "@/components/ui/sector-modal";

const Irrigacao = () => {
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [showSectorModal, setShowSectorModal] = useState(false);
  const [editingSector, setEditingSector] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState(false);
  const [localSectors, setLocalSectors] = useState<Sector[]>([]);
  const [recentHistory, setRecentHistory] = useState<Array<{
    time: string;
    duration: string;
    amount: string;
    sector: string;
    product: string;
  }>>([]);
  
  const { sectors, loading, error, createSector, updateSector, deleteSector } = useSectors();
  const { speak } = useSpeech();

  // Combinar setores do banco com estado local para irrigação
  const combinedSectors = sectors.map(sector => {
    const localSector = localSectors.find(ls => ls.id === sector.id);
    return localSector ? { ...sector, ...localSector } : sector;
  });

  // Timer effect for irrigation countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setLocalSectors(prev => prev.map(sector => {
        if (sector.isIrrigating && sector.lastIrrigation && sector.remainingTime !== undefined) {
          const newRemainingTime = sector.remainingTime - 1;
          if (newRemainingTime <= 0) {
            speak(`Irrigação do ${sector.title} concluída`);
            return { ...sector, isIrrigating: false, remainingTime: undefined };
          }
          return { ...sector, remainingTime: newRemainingTime };
        }
        return sector;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [speak]);

  const handleManualIrrigation = () => {
    const newState = !isIrrigating;
    setIsIrrigating(newState);
    speak(newState ? "Iniciando irrigação agora" : "Parando irrigação");
  };

  const handleModeChange = (checked: boolean) => {
    setIsAutoMode(checked);
    speak(checked ? "Modo automático ativado" : "Modo manual ativado");
  };

  const handleStopIrrigation = () => {
    setIsIrrigating(false);
    speak("Parando irrigação");
  };

  const handleScheduleIrrigation = () => {
    speak("Abrindo agendamento de irrigação");
    // TODO: Implementar modal de agendamento
  };

  const handleSectorEdit = (sectorId: string) => {
    setEditingSector(sectorId);
    setShowSectorModal(true);
  };

  const handleSectorIrrigate = (sectorId: string) => {
    const sector = combinedSectors.find(s => s.id === sectorId);
    if (!sector) return;
    
    const [hours, minutes] = sector.repetitionTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const now = new Date();
    
    // Adicionar ao histórico recente
    const newHistoryEntry = {
      time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      duration: `${totalMinutes} min`,
      amount: `${sector.amount || 250}ml`,
      sector: sector.title,
      product: sector.product
    };
    
    setRecentHistory(prev => [newHistoryEntry, ...prev].slice(0, 10));
    
    // Atualizar setor local com irrigação e histórico
    setLocalSectors(prev => {
      const existing = prev.find(s => s.id === sectorId);
      const irrigations = (existing as any)?.irrigationHistory || [];
      
      const updatedSector = { 
        ...sector, 
        isIrrigating: true,
        lastIrrigation: now,
        remainingTime: totalMinutes * 60,
        irrigationHistory: [
          {
            date: now.toISOString(),
            duration: totalMinutes,  
            volume: sector.amount || 250
          },
          ...irrigations
        ].slice(0, 10)
      } as any;
      
      return existing 
        ? prev.map(s => s.id === sectorId ? updatedSector : s)
        : [...prev, updatedSector];
    });
    
    speak(`Iniciando irrigação do ${sector.title}`);
  };

  const handleSectorStop = (sectorId: string) => {
    setLocalSectors(prev => {
      const existing = prev.find(s => s.id === sectorId);
      const sector = existing || combinedSectors.find(s => s.id === sectorId);
      if (!sector) return prev;
      
      const updatedSector = { ...sector, isIrrigating: false, remainingTime: undefined };
      
      return existing 
        ? prev.map(s => s.id === sectorId ? updatedSector : s)
        : [...prev, updatedSector];
    });
    speak(`Parando irrigação do setor ${sectorId}`);
  };

  const handleSectorView = (sectorId: string) => {
    setEditingSector(sectorId);
    setViewMode(true);
    setShowSectorModal(true);
  };

  const handleToggleAutomatic = (sectorId: string) => {
    setLocalSectors(prev => {
      const existing = prev.find(s => s.id === sectorId);
      const sector = existing || combinedSectors.find(s => s.id === sectorId);
      if (!sector) return prev;
      
      const updatedSector = { ...sector, isAutomatic: !sector.isAutomatic };
      
      return existing 
        ? prev.map(s => s.id === sectorId ? updatedSector : s)
        : [...prev, updatedSector];
    });
    const sector = combinedSectors.find(s => s.id === sectorId);
    speak(`Modo automático ${sector?.isAutomatic ? 'desativado' : 'ativado'} para ${sector?.title}`);
  };

  const handleHarvestStatusChange = (sectorId: string, newStatus: HarvestStatus) => {
    setLocalSectors(prev => {
      const existing = prev.find(s => s.id === sectorId);
      const sector = existing || combinedSectors.find(s => s.id === sectorId);
      if (!sector) return prev;
      
      const updatedSector = { ...sector, harvestStatus: newStatus };
      
      return existing 
        ? prev.map(s => s.id === sectorId ? updatedSector : s)
        : [...prev, updatedSector];
    });
    const sector = combinedSectors.find(s => s.id === sectorId);
    speak(`Status da colheita alterado para ${newStatus} em ${sector?.title}`);
  };

  const handleSectorSubmit = async (data: SectorFormData) => {
    try {
      if (editingSector) {
        await updateSector(editingSector, {
          title: data.title,
          product: data.product,
          repetitionInterval: data.repetitionTime,
          plantingDate: data.plantingDate,
          sensors: data.sensors.map(String),
          amount: data.amount,
          repetitionTime: data.repetitionTime,
          observations: data.observations || "",
          harvest_status: data.harvestStatus,
          harvestForecast: data.harvestForecast,
          plantedSeedlings: data.plantedSeedlings,
          harvestedSeedlings: data.harvestedSeedlings,
          area: data.area,
        });
        speak("Setor atualizado com sucesso");
      } else {
        await createSector({
          title: data.title,
          product: data.product,
          repetitionInterval: data.repetitionTime,
          isIrrigating: false,
          isAutomatic: true,
          plantingDate: data.plantingDate,
          sensorsUI: data.sensors,
          amount: data.amount,
          repetitionTime: data.repetitionTime,
          observations: data.observations || "",
          harvest_status: data.harvestStatus,
          harvestForecast: data.harvestForecast,
          plantedSeedlings: data.plantedSeedlings,
          harvestedSeedlings: data.harvestedSeedlings,
          area: data.area,
        });
        speak("Novo setor criado com sucesso");
      }
    } catch (err) {
      speak("Erro ao salvar setor");
      console.error('Erro ao salvar setor:', err);
    }
    
    setEditingSector(null);
    setViewMode(false);
  };

  const getEditingData = () => {
    if (!editingSector) return undefined;
    const sector = combinedSectors.find(s => s.id === editingSector);
    if (!sector) return undefined;
    
    return {
      title: sector.title,
      product: sector.product,
      plantingDate: sector.plantingDate || new Date(),
      sensors: sector.sensorsUI || [],
      amount: sector.amount,
      repetitionTime: sector.repetitionTime,
      observations: sector.observations,
      harvestStatus: sector.harvest_status,
      harvestForecast: sector.harvestForecast,
      plantedSeedlings: sector.plantedSeedlings || 0,
      harvestedSeedlings: sector.harvestedSeedlings || 0,
      area: sector.area,
    };
  };
  
  const getIrrigationHistory = () => {
    if (!editingSector) return [];
    const localSector = localSectors.find(s => s.id === editingSector);
    const sector = combinedSectors.find(s => s.id === editingSector);
    if (!sector) return [];
    
    // Se há histórico armazenado no setor local, usar ele
    const irrigationHistory = (localSector as any)?.irrigationHistory || [];
    
    const histories = irrigationHistory.slice(0, 3).map((irr: any) => ({
      date: new Date(irr.date).toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      duration: `${irr.duration} min`,
      volume: `${irr.volume}ml`,
      sector: sector.title,
      product: sector.product
    }));
    
    // Se não há histórico suficiente, adicionar alguns fictícios
    const now = new Date();
    for (let i = histories.length; i < 3; i++) {
      const pastDate = new Date(now.getTime() - ((i + 1) * 24 * 60 * 60 * 1000));
      histories.push({
        date: pastDate.toLocaleString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        duration: '15 min',
        volume: `${sector.amount || 250}ml`,
        sector: sector.title,
        product: sector.product
      });
    }
    
    return histories;
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-roboto font-bold text-primary mb-2 flex items-center gap-2">
          <Droplets className="text-eden-blue" />
          Irrigação Inteligente
        </h1>
        <p className="text-muted-foreground font-lato">
          Controle sua irrigação de forma simples e eficiente
        </p>
      </div>



      {/* Alerts */}
      <Card className="mb-6 shadow-card border-eden-orange/20 bg-eden-orange/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-eden-orange" size={20} />
            <div>
              <h3 className="font-roboto font-bold text-eden-orange">Atenção</h3>
              <p className="text-sm font-lato text-foreground/80">
                Umidade do solo está baixa. Considere irrigar em breve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Setores de Plantio */}
      <Card className="mb-6 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-roboto">
              <Droplets size={20} className="text-eden-green" />
              Setores de Plantio
            </CardTitle>
            <Button
              size="sm"
              onClick={() => {
                setEditingSector(null);
                setViewMode(false);
                setShowSectorModal(true);
              }}
              className="gap-1"
            >
              <Plus size={14} />
              Novo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading && <p>Carregando setores...</p>}
            {error && <p className="text-red-500">Erro: {error}</p>}
            {combinedSectors.map((sector) => (
              <SectorCard
                key={sector.id}
                id={sector.id}
                title={sector.title}
                product={sector.product}
                repetitionInterval={sector.repetitionInterval}
                isIrrigating={sector.isIrrigating}
                isAutomatic={sector.isAutomatic}
                harvestStatus={sector.harvest_status}
                harvestForecast={sector.harvestForecast}
                plantingDate={sector.plantingDate}
                amount={sector.amount}
                remainingTime={sector.remainingTime}
                sensors={sector.sensorsUI}
                plantedSeedlings={sector.plantedSeedlings}
                harvestedSeedlings={sector.harvestedSeedlings}
                area={sector.area}
                onEdit={handleSectorEdit}
                onIrrigate={handleSectorIrrigate}
                onStop={handleSectorStop}
                onView={handleSectorView}
                onToggleAutomatic={handleToggleAutomatic}
                onHarvestStatusChange={handleHarvestStatusChange}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick History */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-roboto">
            <History size={20} />
            Histórico Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {(recentHistory.length > 0 ? recentHistory : [
              { 
                time: "06:00", 
                duration: "15 min", 
                amount: "250ml",
                sector: "Setor 1 - Horta A",
                product: "🥬 Alface"
              },
              { 
                time: "Ontem 18:00", 
                duration: "20 min", 
                amount: "320ml",
                sector: "Setor 2 - Horta B", 
                product: "🍅 Tomate"
              },
              { 
                time: "Ontem 06:00", 
                duration: "15 min", 
                amount: "240ml",
                sector: "Setor 1 - Horta A",
                product: "🥬 Alface"
              },
            ]).slice(0, 3).map((entry, index) => (
              <Card key={index} className="bg-secondary/30">
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-lato font-medium">{entry.time}</p>
                        <p className="text-sm text-muted-foreground">{entry.sector}</p>
                        <p className="text-sm text-muted-foreground">{entry.product}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-roboto font-bold text-eden-blue">{entry.amount}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sector Modal */}
      <SectorModal
        open={showSectorModal}
        onOpenChange={(open) => {
          setShowSectorModal(open);
          if (!open) {
            setViewMode(false);
            setEditingSector(null);
          }
        }}
        onSubmit={handleSectorSubmit}
        initialData={getEditingData()}
        viewMode={viewMode}
        irrigationHistory={getIrrigationHistory()}
      />
    </div>
  );
};

export default Irrigacao;