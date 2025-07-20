import z from 'zod';
import { supabase } from '@/lib/supabase';

export const updateWordProgressSchema = z.object({
  wordId: z.number(),
});

export type UpdateWordProgressPayload = z.infer<typeof updateWordProgressSchema>;

export const updateWordProgress = async (payload: UpdateWordProgressPayload) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error('User not found');
  }

  const { error } = await supabase.from('user_word_progress').upsert(
    {
      user_id: user.id,
      word_id: payload.wordId,
      // We can add more logic here, e.g., incrementing mastery_level
      mastery_level: 1,
      last_reviewed_at: new Date().toISOString(),
    },
    { onConflict: 'user_id, word_id' },
  );

  if (error) {
    console.error('Error updating word progress:', error);
    throw new Error('Could not update word progress');
  }
};
