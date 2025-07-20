import { supabase } from '@/lib/supabase';
import type { Theme } from '../themeTypes';

export const getThemes = async (): Promise<Theme[]> => {
  const { data, error } = await supabase.rpc('get_localized_themes');

  if (error) {
    console.error('Error fetching themes:', error);
    throw new Error('Could not fetch themes');
  }

  return data || [];
};
