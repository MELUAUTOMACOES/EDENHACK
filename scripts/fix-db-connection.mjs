import dotenv from 'dotenv';
import postgres from 'postgres';

// Carrega variáveis do server/.env
dotenv.config({ path: 'server/.env' });

console.log('\n🔍 DIAGNÓSTICO DE CONEXÃO COM SUPABASE\n');
console.log('=' .repeat(50));

// URLs possíveis baseadas no seu projeto
const projectRef = 'qexadnikqiwgvcrqkmiv';
const password = 'Deusmeama18*'; // Senha que você já tinha no .env

// Formatos de URL mais comuns do Supabase
const possibleUrls = [
  // Pooler Transaction (porta 6543) - para aplicação
  `postgres://postgres.${projectRef}:${password}@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`,
  
  // Pooler Session (porta 5432) - para migrações
  `postgres://postgres.${projectRef}:${password}@aws-0-sa-east-1.pooler.supabase.com:5432/postgres`,
  
  // Direct antigo (pode não funcionar mais)
  `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`,
];

console.log('Testando conexões possíveis...\n');

async function testConnection(url, label) {
  try {
    console.log(`📡 Testando ${label}...`);
    const sql = postgres(url, { 
      ssl: 'require',
      max: 1,
      timeout: 5
    });
    
    const result = await sql`SELECT current_database(), version()`;
    console.log(`✅ SUCESSO! ${label} funcionou!`);
    console.log(`   Database: ${result[0].current_database}`);
    console.log(`   URL: ${url}\n`);
    
    await sql.end();
    return { success: true, url, label };
  } catch (error) {
    console.log(`❌ Falhou: ${error.message}\n`);
    return { success: false, url, label };
  }
}

async function main() {
  const results = [];
  
  for (let i = 0; i < possibleUrls.length; i++) {
    const url = possibleUrls[i];
    const label = i === 0 ? 'Pooler Transaction (App)' : 
                  i === 1 ? 'Pooler Session (Migrations)' : 
                  'Direct Connection';
    
    const result = await testConnection(url, label);
    results.push(result);
  }
  
  const working = results.filter(r => r.success);
  
  if (working.length > 0) {
    console.log('=' .repeat(50));
    console.log('\n🎉 SOLUÇÃO ENCONTRADA!\n');
    console.log('Adicione estas linhas ao seu server/.env:\n');
    
    // URL para aplicação (pooler transaction)
    const appUrl = working.find(w => w.label.includes('App')) || working[0];
    console.log(`SUPABASE_DB_URL=${appUrl.url}`);
    
    // URL para migrações (pooler session ou direct)
    const migrationUrl = working.find(w => w.label.includes('Migrations')) || working[0];
    console.log(`SUPABASE_DB_MIGRATIONS_URL=${migrationUrl.url}`);
    
    console.log('\nDepois execute:');
    console.log('1. pnpm run db:push');
    console.log('2. pnpm run dev\n');
  } else {
    console.log('=' .repeat(50));
    console.log('\n❌ Nenhuma conexão funcionou!\n');
    console.log('SOLUÇÃO MANUAL NECESSÁRIA:\n');
    console.log('1. Acesse: https://supabase.com/dashboard/project/qexadnikqiwgvcrqkmiv/settings/database');
    console.log('2. Em "Connection string", selecione "Pooler" e "Transaction"');
    console.log('3. Copie a URL completa e cole em SUPABASE_DB_URL');
    console.log('4. Mude para "Session" mode e copie para SUPABASE_DB_MIGRATIONS_URL');
    console.log('5. Se a senha tiver caracteres especiais, use a versão URI encoded\n');
  }
}

main().catch(console.error);
