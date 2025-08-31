// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Se quer ler do server/.env, mantenha essa linha:
dotenv.config({ path: "./server/.env" });
// Se preferir ler da RAIZ (.env), troque por:  import "dotenv/config";

// Use uma URL dedicada para migrações (conexão direta 5432),
// senão cai no pooler e pode falhar. Fallback para SUPABASE_DB_URL.
const raw = process.env.SUPABASE_DB_MIGRATIONS_URL ?? process.env.SUPABASE_DB_URL!;
const connectionString = raw.includes("?") ? `${raw}&sslmode=require` : `${raw}?sslmode=require`;

export default defineConfig({
  schema: "./server/src/db/schema.ts",
  out: "./drizzle",
  driver: "pg", // <- obrigatório nesse “flavor” do 0.20.x
  dbCredentials: {
    connectionString,
    // Alguns ambientes exigem este flag simples
    ssl: true,
  },
});
