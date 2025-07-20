import { supabase } from '@/lib/supabase';
import type { Profile } from '../profileType';

export const getProfile = async (): Promise<Profile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error('User not found');
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
    badges: [], // Les badges sont chargés séparément
  };
};
