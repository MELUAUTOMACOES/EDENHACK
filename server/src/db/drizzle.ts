import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env.js';
import * as schema from './schema.js';

// Força TLS na conexão com Supabase (recomendado)
const client = postgres(env.SUPABASE_DB_URL, { ssl: 'require' as const });
export const db = drizzle(client, { schema });
