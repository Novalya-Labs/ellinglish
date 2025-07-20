import { router, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useProfileStore } from '@/features/profile/profileStore';

export default function PublicLayout() {
  const { user } = useAuth();
  const { profile, getProfile } = useProfileStore();

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (user && profile && profile.username.startsWith('user_')) {
      router.replace('/(public)/profile/onboarding');
    }
  }, [user, profile]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="theme/[slug]" options={{ animation: 'fade' }} />
    </Stack>
  );
}
