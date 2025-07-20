import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link, router, Slot } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/auth-context';
import { useProfileStore } from '@/features/profile/profileStore';

export default function PublicLayout() {
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();
  const { profile } = useProfileStore();

  useEffect(() => {
    if (user && profile && profile.username.startsWith('user_')) {
      router.replace('/(public)/onboarding');
    }
  }, [user, profile]);

  return (
    <>
      <View className="absolute right-4 z-10" style={{ top: top + 16 }}>
        {user && (
          <Link href="/(public)/profile" asChild>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            >
              <Ionicons name="person-circle-outline" size={32} color="white" />
            </TouchableOpacity>
          </Link>
        )}
      </View>
      <Slot />
    </>
  );
}
