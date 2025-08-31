import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authMiddleware } from '../../middleware/auth.js';
import { ProfilesService } from './profiles.service.js';
import { updateProfileSchema } from './profiles.schemas.js';

type Variables = {
  user: {
    id: string;
    email: string | undefined;
    [key: string]: any;
  };
};

const profiles = new Hono<{ Variables: Variables }>();

// Get current user profile
profiles.get('/me', authMiddleware, async (c) => {
  const user = c.get('user');
  
  try {
    let profile = await ProfilesService.getProfileById(user.id);
    
    // Create profile if it doesn't exist
    if (!profile) {
      profile = await ProfilesService.createProfile(user.id);
    }
    
    return c.json(profile);
  } catch (error) {
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update current user profile
profiles.patch('/me', authMiddleware, zValidator('json', updateProfileSchema), async (c) => {
  const user = c.get('user');
  const data = c.req.valid('json');
  
  try {
    let profile = await ProfilesService.getProfileById(user.id);
    
    // Create profile if it doesn't exist
    if (!profile) {
      profile = await ProfilesService.createProfile(user.id, data.name);
    } else {
      profile = await ProfilesService.updateProfile(user.id, data);
    }
    
    return c.json(profile);
  } catch (error) {
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

export { profiles };
