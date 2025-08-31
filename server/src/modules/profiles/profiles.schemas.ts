import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
});

export const profileResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  createdAt: z.date(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
