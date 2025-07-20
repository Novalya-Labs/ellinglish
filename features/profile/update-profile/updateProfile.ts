import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import type { Profile } from '../profileType';

export const updateProfileSchema = z.object({
  username: z.string().min(3).optional(),
  avatar_id: z.number().optional(),
  theme: z.enum(['SYSTEM', 'LIGHT', 'DARK']).optional(),
  expo_token: z.string().optional(),
  enabled_push: z.boolean().optional(),
  language: z.enum(['EN', 'FR']).optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const updateProfile = async (payload: UpdateProfileSchema): Promise<Profile> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not found');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', user.id)
    .select('*, avatar:avatars(*)')
    .single();

  if (error) {
    throw error;
  }

  const { avatar, ...rest } = data;

  return {
    ...rest,
    avatar_url: avatar?.url ?? null,
    badges: [],
  };
};
