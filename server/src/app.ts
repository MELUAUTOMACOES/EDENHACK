import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { rateLimiter } from 'hono-rate-limiter';
import { env } from './config/env';

const app = new Hono();

// Security middleware
app.use('*', secureHeaders());

// CORS middleware - restrict to WEB_ORIGIN
app.use('*', cors({
  origin: env.WEB_ORIGIN,
  credentials: true,
}));

// Logger middleware
app.use('*', logger());

// Rate limiting middleware
app.use('*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-6',
  legacyHeaders: false,
}));

export { app };
