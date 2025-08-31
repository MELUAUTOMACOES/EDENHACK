// drizzle.config.ts
import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Se quer ler do server/.env, mantenha essa linha:
dotenv.config({ path: "./server/.env" });
// Se preferir ler da RAIZ (.env), troque por:  import "dotenv/config";

export default defineConfig({
  schema: "./server/src/db/schema.ts",
  out: "./drizzle",
  driver: "pg", // <- obrigatório nesse “flavor” do 0.20.x
  dbCredentials: {
    connectionString: process.env.SUPABASE_DB_URL!, // ou DATABASE_URL se preferir
  },
});
