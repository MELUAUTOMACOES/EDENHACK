import { useState } from "react";
import { User, MapPin, Sprout, Bell, Settings, Edit, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ProfileEditModal } from "@/components/ui/profile-edit-modal";

const Perfil = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "JOÃO DA SILVA",
    cpf: "123.456.789-00",
    cep: "74000-000",
    address: "Fazenda São José",
    city: "Goiânia",
    state: "GO",
    number: "S/N",
    hectares: "15",
    soilType: "Latossolo",
    mainCrops: ["Milho", "Soja"],
    irrigationMethods: ["Aspersão"]
  });

  const handleProfileUpdate = (data: any) => {
    setProfileData(data);
  };

  return (
    <div className="min-h-screen bg-background pb-20 px-4 pt-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-roboto font-bold text-primary mb-2 flex items-center gap-2">
          <User className="text-eden-green" />
          Meu Perfil
        </h1>
        <p className="text-muted-foreground font-lato">
          Gerencie suas informações e preferências
        </p>
      </div>

      {/* Profile Info */}
      <Card className="mb-6 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-roboto font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground font-lato">Produtor Rural</p>
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground font-lato">
                  {profileData.address}, {profileData.city} - {profileData.state}
                </span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-roboto font-bold text-eden-blue">{profileData.hectares}</p>
              <p className="text-sm text-muted-foreground font-lato">Hectares</p>
            </div>
            <div className="text-center p-3 bg-secondary/30 rounded-lg">
              <p className="text-2xl font-roboto font-bold text-eden-green">3</p>
              <p className="text-sm text-muted-foreground font-lato">Anos no Éden</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farm Details */}
      <Card className="mb-6 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-roboto">
            <Sprout className="text-eden-green" size={20} />
            Detalhes da Fazenda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
            <span className="font-lato">Tipo de Solo</span>
            <Badge className="bg-eden-brown text-white">{profileData.soilType}</Badge>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
            <span className="font-lato">Culturas Principais</span>
            <div className="flex gap-2 flex-wrap">
              {profileData.mainCrops.map(crop => (
                <Badge key={crop} variant="outline">{crop}</Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
            <span className="font-lato">Métodos de Irrigação</span>
            <div className="flex gap-2 flex-wrap">
              {profileData.irrigationMethods.map(method => (
                <Badge key={method} className="bg-eden-blue text-white">{method}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="mb-6 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-roboto">
            <Award className="text-eden-yellow" size={20} />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-eden-green/10 rounded-lg border border-eden-green/20">
              <div className="text-2xl mb-1">🌱</div>
              <p className="text-sm font-lato font-medium">Agricultor Eco</p>
              <p className="text-xs text-muted-foreground">Economizou 30% de água</p>
            </div>
            
            <div className="text-center p-3 bg-eden-blue/10 rounded-lg border border-eden-blue/20">
              <div className="text-2xl mb-1">💧</div>
              <p className="text-sm font-lato font-medium">Mestre da Irrigação</p>
              <p className="text-xs text-muted-foreground">50 irrigações inteligentes</p>
            </div>
            
            <div className="text-center p-3 bg-eden-yellow/10 rounded-lg border border-eden-yellow/20">
              <div className="text-2xl mb-1">📚</div>
              <p className="text-sm font-lato font-medium">Eterno Aprendiz</p>
              <p className="text-xs text-muted-foreground">25 aulas completadas</p>
            </div>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg border border-muted">
              <div className="text-2xl mb-1 opacity-50">🏆</div>
              <p className="text-sm font-lato font-medium opacity-50">Especialista</p>
              <p className="text-xs text-muted-foreground">Em breve...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-roboto">
            <Settings className="text-muted-foreground" size={20} />
            Configurações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-muted-foreground" />
              <span className="font-lato">Notificações Push</span>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Sprout size={18} className="text-muted-foreground" />
              <span className="font-lato">Alertas de Irrigação</span>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <User size={18} className="text-muted-foreground" />
              <span className="font-lato">Dicas Personalizadas</span>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        initialData={profileData}
        onSubmit={handleProfileUpdate}
      />
    </div>
  );
};

export default Perfil;