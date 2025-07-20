import z from 'zod';
import { supabase } from '@/lib/supabase';
import type { Word } from '../wordTypes';

export const getWordsByThemeSchema = z.object({
  themeSlug: z.string(),
});

export type GetWordsByThemePayload = z.infer<typeof getWordsByThemeSchema>;

export const getWordsByTheme = async (payload: GetWordsByThemePayload): Promise<Word[]> => {
  const { data, error } = await supabase
    .from('words')
    .select(
      `
      id,
      text_en,
      text_fr,
      theme:themes!inner(slug)
    `,
    )
    .eq('theme.slug', payload.themeSlug);

  if (error) {
    console.error('Error fetching words by theme:', error);
    throw new Error('Could not fetch words');
  }

  return data.map(({ id, text_en, text_fr }) => ({ id, text_en, text_fr }));
};
