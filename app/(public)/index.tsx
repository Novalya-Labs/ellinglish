import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { Image, Platform, SafeAreaView, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '@/components/ui/Text';
import { Env } from '@/constants/Env';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';

const AnimatedFlower = Animated.createAnimatedComponent(Image);

const MainScreen: React.FC = () => {
  const { user, signInWithGoogle, signInWithApple } = useAuth();
  const { top } = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1, false);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${rotation.value}deg`,
        },
      ],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900 relative">
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
      <View className="flex-1 items-center justify-center">
        <Animated.View className="flex-row">
          {Env.APP_NAME.split('').map((word, index) => {
            return (
              <Animated.Text
                key={`${word}-${index}`}
                entering={FadeInUp.delay(100 * index)}
                className="text-7xl text-white leading-snug"
                style={{ fontFamily: 'DynaPuffBold' }}
              >
                {word}
              </Animated.Text>
            );
          })}
        </Animated.View>
        <View className="flex-row gap-4 mt-4 mb-8">
          <AnimatedFlower
            source={require('@/assets/images/flowers/green_flower.png')}
            className="size-8"
            style={animatedStyle}
          />
          <AnimatedFlower
            source={require('@/assets/images/flowers/lila_flower.png')}
            className="size-8"
            style={animatedStyle}
          />
          <AnimatedFlower
            source={require('@/assets/images/flowers/yellow_flower.png')}
            className="size-8"
            style={animatedStyle}
          />
        </View>

        {user ? (
          <View className="items-center gap-y-4">
            <Link href="/(public)/words" asChild>
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                activeOpacity={1}
                className="w-full max-w-sm flex-row items-center justify-center gap-2 bg-white dark:bg-white rounded-full py-4 px-8 active:scale-95 transition-all duration-300"
              >
                <Text weight="bold" className="text-pink-200 dark:text-purple-900 text-center">
                  Start Learning
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View className="items-center gap-y-4 w-full">
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                signInWithGoogle();
              }}
              activeOpacity={1}
              className="w-full max-w-sm flex-row items-center justify-center gap-2 bg-white dark:bg-white rounded-full py-4 px-8 active:scale-95 transition-all duration-300"
            >
              <Ionicons name="logo-google" size={18} color={isDarkMode ? '#581c87' : '#fbcfe8'} />
              <Text weight="bold" className="text-pink-200 dark:text-purple-900 text-center">
                Sign in with Google
              </Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  signInWithApple();
                }}
                activeOpacity={1}
                className="w-full max-w-sm flex-row items-center justify-center gap-2 bg-white dark:bg-white rounded-full py-4 px-8 active:scale-95 transition-all duration-300"
              >
                <Ionicons name="logo-apple" size={18} color={isDarkMode ? '#581c87' : '#fbcfe8'} />

                <Text weight="bold" className="text-pink-200 dark:text-purple-900 text-center">
                  Sign in with Apple
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;
