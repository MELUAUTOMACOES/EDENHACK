import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export type HarvestStatus = "seeded" | "growing" | "ready" | "harvested" | "paused";

export interface IrrigationRecord {
  at: string;
  ml: number;
  duration_min: number;
}

export interface Sector {
  id: string;
  name: string;
  farm_id: string;
  moisture_level?: string;
  created_at: string;
  // New database fields
  planting_date?: string;
  harvest_eta?: string;
  sensors?: string[];
  quantity_ml?: number;
  repeat_every_hours?: number;
  harvest_status: HarvestStatus;
  seedlings_planted?: number;
  seedlings_harvested?: number;
  last_irrigations?: IrrigationRecord[];
  // Campos adicionais para compatibilidade com a UI
  title: string;
  product: string;
  repetitionInterval: string;
  isIrrigating: boolean;
  isAutomatic: boolean;
  plantingDate: Date;
  sensorsUI: number[];
  amount: number;
  repetitionTime: string;
  observations: string;
  harvestForecast: Date;
  lastIrrigation?: Date;
  remainingTime?: number;
  plantedSeedlings?: number;
  harvestedSeedlings?: number;
}

export const useSectors = () => {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar setores do banco
  const loadSectors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mapear dados do banco para o formato da UI
      const mappedSectors: Sector[] = (data || []).map(sector => ({
        ...sector,
        title: sector.name,
        product: sector.moisture_level || 'Produto não definido',
        repetitionInterval: `${sector.repeat_every_hours || 8}:00`,
        isIrrigating: false,
        isAutomatic: true,
        plantingDate: sector.planting_date ? new Date(sector.planting_date) : new Date(sector.created_at),
        sensorsUI: sector.sensors?.map((_, index) => index + 1) || [1, 2],
        amount: sector.quantity_ml || 250,
        repetitionTime: `${sector.repeat_every_hours || 8}:00`,
        observations: '',
        harvestForecast: sector.harvest_eta ? new Date(sector.harvest_eta) : new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        plantedSeedlings: sector.seedlings_planted || 0,
        harvestedSeedlings: sector.seedlings_harvested || 0,
      }));

      setSectors(mappedSectors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  };

  // Criar novo setor
  const createSector = async (sectorData: Partial<Sector>) => {
    try {
      // Primeiro, precisamos de uma fazenda. Vamos criar uma se não existir
      let { data: farms } = await supabase
        .from('farms')
        .select('id')
        .limit(1);

      let farmId: string;

      if (!farms || farms.length === 0) {
        // Criar fazenda padrão
        const { data: newFarm, error: farmError } = await supabase
          .from('farms')
          .insert([{ name: 'Fazenda Principal' }])
          .select('id')
          .single();

        if (farmError) throw farmError;
        farmId = newFarm.id;
      } else {
        farmId = farms[0].id;
      }

      const { data, error } = await supabase
        .from('sectors')
        .insert([{
          name: sectorData.title || 'Novo Setor',
          farm_id: farmId,
          moisture_level: sectorData.product || 'Produto não definido',
          planting_date: sectorData.plantingDate ? sectorData.plantingDate.toISOString().split('T')[0] : null,
          harvest_eta: sectorData.harvestForecast ? sectorData.harvestForecast.toISOString().split('T')[0] : null,
          sensors: sectorData.sensorsUI?.map(s => `Sensor ${s}`) || [],
          quantity_ml: sectorData.amount || 250,
          repeat_every_hours: parseInt(sectorData.repetitionTime?.split(':')[0] || '8'),
          harvest_status: sectorData.harvest_status || 'seeded',
          seedlings_planted: sectorData.plantedSeedlings || 0,
          seedlings_harvested: sectorData.harvestedSeedlings || 0,
          last_irrigations: []
        }])
        .select()
        .single();

      if (error) throw error;

      // Recarregar setores
      await loadSectors();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar setor');
      throw err;
    }
  };

  // Atualizar setor
  const updateSector = async (id: string, updates: Partial<Sector>) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .update({
          name: updates.title,
          moisture_level: updates.product,
          planting_date: updates.plantingDate ? updates.plantingDate.toISOString().split('T')[0] : null,
          harvest_eta: updates.harvestForecast ? updates.harvestForecast.toISOString().split('T')[0] : null,
          sensors: updates.sensorsUI?.map(s => `Sensor ${s}`) || [],
          quantity_ml: updates.amount || 250,
          repeat_every_hours: parseInt(updates.repetitionTime?.split(':')[0] || '8'),
          harvest_status: updates.harvest_status || 'seeded',
          seedlings_planted: updates.plantedSeedlings || 0,
          seedlings_harvested: updates.harvestedSeedlings || 0
        })
        .eq('id', id);

      if (error) throw error;

      // Recarregar setores
      await loadSectors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar setor');
      throw err;
    }
  };

  // Deletar setor
  const deleteSector = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Recarregar setores
      await loadSectors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar setor');
      throw err;
    }
  };

  useEffect(() => {
    loadSectors();
  }, []);

  return {
    sectors,
    loading,
    error,
    createSector,
    updateSector,
    deleteSector,
    refreshSectors: loadSectors
  };
};
