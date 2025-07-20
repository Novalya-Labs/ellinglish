import { useRouter } from 'expo-router';
import { ArrowLeftIcon, LockIcon, LogOutIcon } from 'lucide-react-native';
import { useCallback, useEffect } from 'react';
import { Alert, FlatList, Image, Pressable, SafeAreaView, TouchableOpacity, View } from 'react-native';
import ToggleTheme from '@/components/toggle-theme';
import Text from '@/components/ui/Text';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { useProfileStore } from '@/features/profile/profileStore';

const ProfileScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile, getBadges } = useProfileStore();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    getBadges();
  }, [getBadges]);

  const handleSignOut = useCallback(() => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/');
        },
      },
    ]);
  }, [signOut, router]);

  const renderHeader = useCallback(() => {
    return (
      <View>
        <View className="flex-row justify-between items-center mb-10">
          <View className="flex-row items-center">
            <Pressable onPress={() => router.back()} className="active:scale-95 transition-all duration-300 pr-6">
              <ArrowLeftIcon size={24} color={isDarkMode ? 'white' : 'black'} strokeWidth={4} />
            </Pressable>
            <Text variant="h1">Profile</Text>
          </View>
          {profile && (
            <TouchableOpacity
              onPress={handleSignOut}
              activeOpacity={1}
              className="bg-red-500 rounded-full p-3 active:scale-95 transition-all duration-300"
            >
              <LogOutIcon size={16} color="white" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>
        {profile && (
          <View className="gap-2 justify-center items-center">
            {profile.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} className="size-20 rounded-full mb-2" />
            ) : null}
            <Text variant="h3" weight="bold">
              {profile.username}
            </Text>
            <Text className="text-sm text-neutral-600 dark:text-purple-200">{profile.email}</Text>
            <View className="mt-4">
              <ToggleTheme />
            </View>
          </View>
        )}
        <View>
          <Text variant="h2" className="mb-4">
            Badges
          </Text>
        </View>
      </View>
    );
  }, [profile, isDarkMode, handleSignOut, router]);

  return (
    <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900">
      <FlatList
        data={profile?.badges || []}
        keyExtractor={(item) => item.id.toString()}
        style={{ flexGrow: 1 }}
        contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View className="items-center p-4 rounded-lg relative border border-pink-300 dark:border-purple-200 bg-white/60 dark:bg-purple-900/80">
            <Text className="text-4xl mb-2 leading-snug">{item.icon}</Text>
            <Text className="text-sm text-center mb-1 text-pink-900 dark:text-purple-200">{item.name}</Text>
            <Text className="text-xs text-center text-pink-700 dark:text-purple-200">{item.description}</Text>
            {!item.unlocked && (
              <View className="absolute top-2 right-2">
                <LockIcon size={18} color={isDarkMode ? 'white' : 'black'} strokeWidth={2} />
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
