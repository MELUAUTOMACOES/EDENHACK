import { serve } from '@hono/node-server';
import { app } from './app';
import { api } from './routes';
import { env } from './config/env';

// Mount API routes
app.route('/api', api);

// Health check at root
app.get('/', (c) => {
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
    serve({
      fetch: app.fetch,
      port,
    });
  } catch (err) {
    const code = (err as any)?.code;
    if (code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} in use, trying ${port + 1}...`);
      port += 1;
      startServer();
    } else {
      throw err;
    }
  }
};

startServer();
