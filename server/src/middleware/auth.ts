import { createMiddleware } from 'hono/factory';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

type Variables = {
  user: {
    id: string;
    email: string | undefined;
    [key: string]: any;
  };
};

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);

export const authMiddleware = createMiddleware<{ Variables: Variables }>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401);
  }

  const token = authHeader.substring(7);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    c.set('user', {
      id: user.id,
      email: user.email,
      ...user.user_metadata,
    });

    await next();
  } catch (error) {
    return c.json({ error: 'Authentication failed' }, 401);
  }
});
