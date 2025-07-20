import { supabase } from '@/lib/supabase';
import type { Avatar } from '../profileType';

export const getAvatars = async (): Promise<Avatar[]> => {
  const { data, error } = await supabase.from('avatars').select('*');

  if (error) {
    console.error('Error fetching avatars:', error);
    throw new Error('Could not fetch avatars');
  }

  return data || [];
};
