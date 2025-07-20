import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Text from '@/components/ui/Text';
import { useAuth } from '@/contexts/auth-context';
import { useProfileStore } from '@/features/profile/profileStore';

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { profile, getBadges } = useProfileStore();

  useEffect(() => {
    getBadges();
  }, [getBadges]);

  return (
    <SafeAreaView className="flex-1">
      <View className="p-4">
        <Text variant="h1">Profile</Text>
        {profile && (
          <>
            <Text>Username: {profile.username}</Text>
            <Text>Email: {profile.email}</Text>
          </>
        )}

        <View className="mt-8">
          <Text variant="h2" className="mb-4">
            Badges
          </Text>
          <FlatList
            data={profile?.badges || []}
            numColumns={4}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="items-center p-2" style={{ opacity: item.unlocked ? 1 : 0.3 }}>
                <Text className="text-4xl">{item.icon}</Text>
                <Text className="text-xs text-center">{item.name}</Text>
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            signOut();
          }}
          activeOpacity={1}
          className="bg-red-500 rounded-full py-2 px-4 mt-8 active:scale-95 transition-all duration-300 self-start"
        >
          <Text weight="bold" className="text-white text-xs">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
