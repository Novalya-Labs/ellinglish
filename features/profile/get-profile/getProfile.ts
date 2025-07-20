import { supabase } from '@/lib/supabase';
import type { Profile } from '../profileType';

// No user parameter needed here
export const getProfile = async (): Promise<Profile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(
      `
      *,
      avatar:avatars(id, name, slug, url)
    `,
    )
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  const { avatar, ...rest } = data;

  if (!avatar) {
    return {
      ...rest,
      avatar_url: null,
      badges: [],
    };
  }

  return {
    ...rest,
    avatar_url: avatar.url,
    badges: [], // Badges are loaded separately
  };
};
