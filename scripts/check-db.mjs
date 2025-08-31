import dotenv from 'dotenv';
import postgres from 'postgres';

// Carrega variáveis do server/.env
dotenv.config({ path: 'server/.env' });

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('Erro: SUPABASE_DB_URL não está definida.');
  process.exit(1);
}

// Força SSL (recomendado para Supabase)
const sql = postgres(url, { ssl: 'require' });

(async () => {
  try {
    const v = await sql`select version()`;
    console.log('Conectado ao Postgres:', v[0].version);

    const rows = await sql`
      select table_schema, table_name
      from information_schema.tables
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name;
    `;

    console.log('Tabelas no schema public:');
    for (const r of rows) console.log(`- ${r.table_schema}.${r.table_name}`);
  } catch (err) {
    console.error('Falha na conexão/consulta:', err);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
  }
})();
