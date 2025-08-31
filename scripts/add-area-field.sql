-- Adicionar campo area na tabela sectors
ALTER TABLE sectors 
ADD COLUMN IF NOT EXISTS area NUMERIC;

-- Comentário sobre o campo
COMMENT ON COLUMN sectors.area IS 'Área aproximada do setor em metros quadrados';
