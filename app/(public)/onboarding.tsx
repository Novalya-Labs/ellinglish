import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Text from '@/components/ui/Text';
import { useTheme } from '@/contexts/theme-context';
import { useProfileStore } from '@/features/profile/profileStore';
import type { Avatar } from '@/features/profile/profileType';

const OnboardingScreen = () => {
  const { isDarkMode } = useTheme();
  const { updateProfile, getAvatars } = useProfileStore();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true);
  const [username, setUsername] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAvatars()
      .then(setAvatars)
      .catch(() => Alert.alert('Error', 'Could not fetch avatars.'))
      .finally(() => setLoadingAvatars(false));
  }, [getAvatars]);

  const handleSave = async () => {
    if (!username || !selectedAvatarId) {
      Alert.alert('Missing information', 'Please choose a username and an avatar.');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({ username, avatar_id: selectedAvatarId });
      router.replace('/(public)');
    } catch {
      Alert.alert('Error', 'Could not save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isButtonDisabled = !username || !selectedAvatarId || isSaving || username.length < 3;

  if (loadingAvatars) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <Pressable onPress={() => Keyboard.dismiss()} className="flex-1 bg-pink-200 dark:bg-purple-900 p-4">
      <SafeAreaView className="flex-1 justify-center items-center">
        <Animated.View entering={FadeInUp.duration(1000)}>
          <Text variant="h1" className="text-white text-center mb-8">
            Welcome to Ellinglish!
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(1000)} className="w-full max-w-sm">
          <Text className="text-white mb-2">Choose your username (min 3 chars)</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            className="bg-white rounded-full py-4 px-6 mb-8 text-center"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400).duration(1000)}>
          <Text className="text-white mb-4 text-center">Choose your avatar</Text>
          <View className="flex-row justify-center gap-8">
            {avatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                activeOpacity={0.8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  Keyboard.dismiss();
                  setSelectedAvatarId(avatar.id);
                }}
                className="active:scale-95 transition-all duration-100"
              >
                <Image
                  source={{ uri: avatar.url }}
                  className={`w-24 h-24 rounded-full ${selectedAvatarId === avatar.id ? 'border-4 border-white' : ''}`}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(1000)} className="mt-12">
          <TouchableOpacity
            onPress={isButtonDisabled ? undefined : handleSave}
            style={{ opacity: isButtonDisabled ? 0.5 : 1 }}
            className="bg-white rounded-full py-4 px-12 items-center justify-center flex-row gap-4 active:scale-95 transition-all duration-100"
          >
            {isSaving ? <ActivityIndicator color={isDarkMode ? '#581c87' : '#fbcfe8'} /> : null}
            <Text variant="h3" weight="bold" className="text-pink-200 dark:text-purple-900">
              Let's Start!
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </Pressable>
  );
};

export default OnboardingScreen;
