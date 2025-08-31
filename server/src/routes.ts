import { Hono } from 'hono';
import { health } from './modules/health/health.routes';
import { profiles } from './modules/profiles/profiles.routes';

const api = new Hono();

// Mount routes with /api prefix
api.route('/health', health);
api.route('/profiles', profiles);

export { api };
