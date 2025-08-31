import { eq } from 'drizzle-orm';
import { db } from '../../db/drizzle';
import { profiles } from '../../db/schema';
import { UpdateProfileInput } from './profiles.schemas';

export class ProfilesService {
  static async getProfileById(id: string) {
    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, id))
      .limit(1);
    
    return profile;
  }

  static async updateProfile(id: string, data: UpdateProfileInput) {
    const [updatedProfile] = await db
      .update(profiles)
      .set({
        name: data.name,
      })
      .where(eq(profiles.id, id))
      .returning();

    return updatedProfile;
  }

  static async createProfile(id: string, name?: string) {
    const [newProfile] = await db
      .insert(profiles)
      .values({
        id,
        name,
      })
      .returning();

    return newProfile;
  }
}
