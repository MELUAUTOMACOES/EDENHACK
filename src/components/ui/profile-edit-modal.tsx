import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  name: string;
  cpf: string;
  cep: string;
  address: string;
  city: string;
  state: string;
  number: string;
  hectares: string;
  soilType: string;
  mainCrops: string[];
  irrigationMethods: string[];
}

interface ProfileEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProfileData;
  onSubmit: (data: ProfileData) => void;
}

const soilTypes = [
  "Latossolo",
  "Argissolo", 
  "Neossolo",
  "Cambissolo",
  "Gleissolo",
  "Plintossolo",
  "Organossolo"
];

const cropOptions = [
  "Milho",
  "Soja", 
  "Arroz",
  "Feijão",
  "Algodão",
  "Cana-de-açúcar",
  "Alface",
  "Tomate",
  "Cenoura",
  "Batata"
];

const irrigationOptions = [
  "Aspersão",
  "Gotejamento",
  "Microaspersão", 
  "Sulcos",
  "Inundação",
  "Pivô Central"
];

export function ProfileEditModal({ open, onOpenChange, initialData, onSubmit }: ProfileEditModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    cpf: "",
    cep: "",
    address: "",
    city: "",
    state: "",
    number: "",
    hectares: "",
    soilType: "",
    mainCrops: [],
    irrigationMethods: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatName = (value: string) => {
    return value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '').toUpperCase();
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    return numbers.length === 11;
  };

  const validateCEP = (cep: string) => {
    const numbers = cep.replace(/\D/g, '');
    return numbers.length === 8;
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    let formattedValue = value;
    
    if (field === 'name') {
      formattedValue = formatName(value);
    } else if (field === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (field === 'cep') {
      formattedValue = formatCEP(value);
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleSelectChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: 'mainCrops' | 'irrigationMethods', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: "Nome é obrigatório", variant: "destructive" });
      return;
    }
    
    if (!validateCPF(formData.cpf)) {
      toast({ title: "CPF deve ter 11 dígitos", variant: "destructive" });
      return;
    }
    
    if (!validateCEP(formData.cep)) {
      toast({ title: "CEP deve ter 8 dígitos", variant: "destructive" });
      return;
    }

    if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim()) {
      toast({ title: "Endereço completo é obrigatório", variant: "destructive" });
      return;
    }

    onSubmit(formData);
    onOpenChange(false);
    toast({ title: "Perfil atualizado com sucesso!" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-roboto">Editar Perfil</DialogTitle>
          <DialogDescription className="font-lato">
            Atualize suas informações pessoais e de propriedade.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-lato">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="JOÃO DA SILVA"
                className="font-lato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf" className="font-lato">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                maxLength={14}
                className="font-lato"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cep" className="font-lato">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                className="font-lato"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="address" className="font-lato">Logradouro</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua das Flores"
                className="font-lato"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number" className="font-lato">Número</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="123"
                className="font-lato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city" className="font-lato">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Goiânia"
                className="font-lato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state" className="font-lato">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="GO"
                maxLength={2}
                className="font-lato"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hectares" className="font-lato">Número de Hectares</Label>
              <Input
                id="hectares"
                type="number"
                value={formData.hectares}
                onChange={(e) => handleInputChange('hectares', e.target.value)}
                placeholder="15"
                className="font-lato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="soilType" className="font-lato">Tipo de Solo</Label>
              <Select value={formData.soilType} onValueChange={(value) => handleSelectChange('soilType', value)}>
                <SelectTrigger className="font-lato">
                  <SelectValue placeholder="Selecione o tipo de solo" />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map((soil) => (
                    <SelectItem key={soil} value={soil} className="font-lato">
                      {soil}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-lato">Culturas Principais</Label>
            <div className="grid grid-cols-3 gap-2">
              {cropOptions.map((crop) => (
                <label key={crop} className="flex items-center space-x-2 font-lato text-sm">
                  <input
                    type="checkbox"
                    checked={formData.mainCrops.includes(crop)}
                    onChange={(e) => handleMultiSelectChange('mainCrops', crop, e.target.checked)}
                    className="rounded"
                  />
                  <span>{crop}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-lato">Métodos de Irrigação</Label>
            <div className="grid grid-cols-3 gap-2">
              {irrigationOptions.map((method) => (
                <label key={method} className="flex items-center space-x-2 font-lato text-sm">
                  <input
                    type="checkbox"
                    checked={formData.irrigationMethods.includes(method)}
                    onChange={(e) => handleMultiSelectChange('irrigationMethods', method, e.target.checked)}
                    className="rounded"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-lato">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="font-lato">
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}