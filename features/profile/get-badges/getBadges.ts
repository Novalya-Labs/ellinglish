import { supabase } from '@/lib/supabase';
import type { Badge } from '../profileType';

export const getBadges = async (): Promise<Badge[]> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error('User not found');
  }

  const { data: allBadges, error: allBadgesError } = await supabase.rpc('get_localized_badges');

  if (allBadgesError) {
    console.error('Error fetching all badges:', allBadgesError);
    throw new Error('Could not fetch badges');
  }

  const { data: userBadges, error: userBadgesError } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', user.id);

  if (userBadgesError) {
    console.error('Error fetching user badges:', userBadgesError);
    throw new Error('Could not fetch user badges');
  }

  const unlockedBadgeIds = new Set(userBadges.map((b) => b.badge_id));

  const combinedBadges: Badge[] = allBadges.map((badge) => ({
    ...badge,
    unlocked: unlockedBadgeIds.has(badge.id),
  }));

  return combinedBadges;
};
