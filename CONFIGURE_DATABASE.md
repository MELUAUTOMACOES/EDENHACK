# 🚨 CONFIGURAÇÃO URGENTE DO BANCO DE DADOS

## O Problema
A URL `db.qexadnikqiwgvcrqkmiv.supabase.co` não existe mais. O Supabase mudou o formato.

## SOLUÇÃO RÁPIDA

### 1. Acesse seu projeto Supabase
Link direto: https://supabase.com/dashboard/project/qexadnikqiwgvcrqkmiv/settings/database

### 2. Copie as URLs corretas

No painel do Supabase, você verá "Connection string". 

**Para SUPABASE_DB_URL (aplicação):**
- Selecione: Mode = "Transaction" 
- Copie a URL que aparece
- Formato esperado: `postgresql://postgres.qexadnikqiwgvcrqkmiv:Deusmeama18*@aws-1-sa-east-1.pooler.supabase.com:6543/postgres`

**Para SUPABASE_DB_MIGRATIONS_URL (migrações):**
- Selecione: Mode = "Session"
- Copie a URL que aparece  
- Formato esperado: `postgresql://postgres.qexadnikqiwgvcrqkmiv:Deusmeama18*@aws-1-sa-east-1.pooler.supabase.com:5432/postgres`

### 3. Atualize server/.env

Abra `server/.env` e substitua as linhas:

```env
# Para o servidor (aplicação)
SUPABASE_DB_URL=COLE_AQUI_A_URL_TRANSACTION_MODE

# Para migrações (drizzle-kit)
SUPABASE_DB_MIGRATIONS_URL=COLE_AQUI_A_URL_SESSION_MODE
```

### 4. Execute os comandos

```bash
# Se der erro de SSL, execute antes:
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"

# Aplicar o schema
pnpm run db:push

# Rodar o projeto
pnpm run dev
```

## URLs Prováveis (baseadas no seu projeto)

Se não conseguir acessar o painel, tente estas URLs com sua senha:

```env
# Opção 1 - Pooler AWS
SUPABASE_DB_URL=postgres://postgres.qexadnikqiwgvcrqkmiv:Deusmeama18*@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
SUPABASE_DB_MIGRATIONS_URL=postgres://postgres.qexadnikqiwgvcrqkmiv:Deusmeama18*@aws-0-sa-east-1.pooler.supabase.com:5432/postgres

# Opção 2 - Se a senha tiver problema, use versão URL-encoded
# Substitua "Deusmeama18*" por "Deusmeama18%2A" (o * vira %2A)
SUPABASE_DB_URL=postgres://postgres.qexadnikqiwgvcrqkmiv:Deusmeama18%2A@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
SUPABASE_DB_MIGRATIONS_URL=postgres://postgres.qexadnikqiwgvcrqkmiv:Deusmeama18%2A@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
```

## Teste Rápido

Após configurar, teste com:

```bash
cd C:\Users\lucas\Downloads\Éden\Éden
node scripts/check-db.mjs
```

Se conectar, execute `pnpm run db:push` e depois `pnpm run dev`.
