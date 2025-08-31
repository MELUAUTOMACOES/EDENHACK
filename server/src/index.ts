// server/src/index.ts
import { serve } from '@hono/node-server';
import { app } from './app.js';
import { api } from './routes.js';   // ajuste aqui se o arquivo não for index.ts
import { env } from './config/env.js';
import geminiRouter from './routes/gemini.js';
import type { Context } from 'hono';

// Mount API routes existentes
app.route('/api', api);

// ✅ Monte o Gemini DENTRO de /api
app.route('/api/gemini', geminiRouter);

// Health check
app.get('/', (c: Context) => {
  return c.json({ 
    message: 'Éden API Server', 
    version: '1.0.0', 
    status: 'running' 
  });
});

let port = parseInt(env.PORT);
const startServer = () => {
  try {
    console.log(`🌱 Éden API Server starting on port ${port} (env: ${env.NODE_ENV})`);
    serve({ fetch: app.fetch, port });
  } catch (err: any) {
    if (err?.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} in use, trying ${port + 1}...`);
      port += 1;
      startServer();
    } else {
      throw err;
    }
  }
};

startServer();
