import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: 'server/.env' });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE: z.string(),
  SUPABASE_DB_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_ORIGIN: z.string().url().default('http://localhost:5000'),
  WEB_ORIGIN: z.string().url().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);
