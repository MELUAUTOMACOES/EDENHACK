import { Hono } from 'hono';
import { health } from './modules/health/health.routes.js';
import { profiles } from './modules/profiles/profiles.routes.js';

const api = new Hono();

// Mount routes with /api prefix
api.route('/health', health);
api.route('/profiles', profiles);

export { api };
