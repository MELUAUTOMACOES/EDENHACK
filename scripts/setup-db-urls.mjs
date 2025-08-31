#!/usr/bin/env node
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', 'server', '.env');

console.log(`
🌱 CONFIGURAÇÃO DO BANCO SUPABASE - ÉDEN
=========================================

Para obter as URLs corretas:
1. Acesse seu projeto em: https://supabase.com/dashboard
2. Vá em Settings (ícone de engrenagem) > Database
3. Em "Connection string", você verá diferentes opções

IMPORTANTE: O Supabase tem 2 tipos de conexão:
- Pooler (Supavisor): Para aplicações (usa porta 6543 ou 5432)
- Direct: Para migrações (usa porta 5432 ou 6432)
`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
  try {
    console.log('\n📋 PASSO 1: Connection Pooler (para o servidor)\n');
    console.log('No painel Supabase, em "Connection pooler", selecione:');
    console.log('- Mode: Transaction');
    console.log('- Copie a "Connection string" que aparece');
    console.log('\nExemplo do formato esperado:');
    console.log('postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres\n');
    
    const poolerUrl = await question('Cole aqui a URL do Pooler (Transaction mode): ');
    
    if (!poolerUrl || !poolerUrl.includes('pooler.supabase.com')) {
      console.error('❌ URL inválida. Deve conter "pooler.supabase.com"');
      process.exit(1);
    }

    console.log('\n📋 PASSO 2: Direct Connection (para migrações)\n');
    console.log('Ainda no painel, mude para "Direct connection" e copie a URL');
    console.log('\nExemplo do formato esperado:');
    console.log('postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres');
    console.log('OU');
    console.log('postgres://postgres:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres\n');
    
    const directUrl = await question('Cole aqui a URL Direct (ou Session mode do pooler): ');
    
    if (!directUrl || (!directUrl.includes('supabase.co') && !directUrl.includes('pooler.supabase.com'))) {
      console.error('❌ URL inválida.');
      process.exit(1);
    }

    // Lê o .env atual
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    // Atualiza ou adiciona as URLs
    const updateEnvVar = (content, key, value) => {
      const regex = new RegExp(`^${key}=.*$`, 'gm');
      if (regex.test(content)) {
        return content.replace(regex, `${key}=${value}`);
      } else {
        return content + `\n${key}=${value}`;
      }
    };

    envContent = updateEnvVar(envContent, 'SUPABASE_DB_URL', poolerUrl.trim());
    envContent = updateEnvVar(envContent, 'SUPABASE_DB_MIGRATIONS_URL', directUrl.trim());

    // Salva o arquivo
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ URLs configuradas com sucesso em server/.env!');
    console.log('\n🚀 Próximos passos:');
    console.log('1. Execute: pnpm run db:push');
    console.log('2. Se der erro de SSL, execute:');
    console.log('   $env:NODE_TLS_REJECT_UNAUTHORIZED = "0"; pnpm run db:push');
    console.log('3. Depois rode: pnpm run dev\n');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
