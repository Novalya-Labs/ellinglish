import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '@/components/ui/Text';
import { useTheme } from '@/contexts/theme-context';
import { useGameStore } from '@/features/words/wordStore';

const normalizeText = (text: string) => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const ThemeGameScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { top } = useSafeAreaInsets();
  const { isDarkMode } = useTheme();

  const {
    words,
    currentWordIndex,
    loading,
    streak,
    fetchWords,
    answerCorrectly,
    answerIncorrectly,
    skipWord,
    resetGame,
  } = useGameStore();

  const currentWord = words[currentWordIndex];
  const [isSkipping, setIsSkipping] = useState(false);
  const [inputText, setInputText] = useState('');
  const wordTranslationX = useSharedValue(0);
  const wordTranslationY = useSharedValue(0);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      fetchWords({ themeSlug: slug });
    }
  }, [slug, fetchWords]);

  useEffect(() => {
    if (inputText.length > 0) {
      const normalizedInput = normalizeText(inputText);
      const normalizedWord = normalizeText(currentWord?.text_fr || '');

      if (normalizedWord.length === normalizedInput.length) {
        if (normalizedInput === normalizedWord) {
          answerCorrectly({ wordId: currentWord.id });
        } else {
          answerIncorrectly({ wordId: currentWord.id });
        }

        setInputText('');
      }
    }
  }, [inputText, currentWord, answerCorrectly, answerIncorrectly]);

  useEffect(() => {
    let timeout: number | null = null;

    if (wordTranslationX.value) {
      timeout = setTimeout(() => {
        wordTranslationX.value = withTiming(-150, { duration: 1000 });
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [wordTranslationX]);

  useEffect(() => {
    if (isSkipping) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [isSkipping]);

  const handleClose = useCallback(() => {
    resetGame();

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router, resetGame]);

  const streakFontSizeAnimation = useAnimatedStyle(() => ({
    color: isDarkMode ? 'white' : 'black',
    fontWeight: 'bold',
    fontFamily: 'DynaPuffBold',
    fontSize: withTiming(16 * streak * 0.4, { duration: 200 }),
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      wordTranslationX.value = event.translationX;
      wordTranslationY.value = event.translationY;

      if (event.translationX < -150 && !isSkipping) {
        runOnJS(setIsSkipping)(true);
      } else {
        runOnJS(setIsSkipping)(false);
      }
    })
    .onFinalize((event) => {
      wordTranslationX.value = withSpring(0);
      wordTranslationY.value = withSpring(0);

      if (event.translationX < -150) {
        runOnJS(skipWord)();
      }

      runOnJS(setIsSkipping)(false);
    });

  const wordViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wordTranslationX.value }, { translateY: wordTranslationY.value }],
  }));

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-pink-200 dark:bg-purple-900">
        <Image
          source={require('@/assets/images/flowers/lila_flower.png')}
          className="size-20 animate-spin"
          resizeMode="contain"
        />
      </SafeAreaView>
    );
  }

  if (!words.length || !currentWord) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-pink-200 dark:bg-purple-900">
        <Text variant="h2" className="text-center text-gray-600">
          No words available for this theme
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900 relative">
        <View
          className="absolute left-0 right-0 flex-row items-center justify-center px-4 z-10"
          style={{ top: top + 10 }}
        >
          <Pressable
            onPress={handleClose}
            className="absolute left-4 bg-black/20 rounded-full p-2 active:scale-90 transition-all duration-100"
          >
            <X size={24} color={isDarkMode ? 'white' : 'black'} />
          </Pressable>

          <Animated.View>
            <Animated.Text style={streakFontSizeAnimation}>🔥 {streak}</Animated.Text>
          </Animated.View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-1 items-center justify-center">
            <GestureDetector gesture={panGesture}>
              <Animated.View style={wordViewStyle}>
                <Text
                  adjustsFontSizeToFit
                  style={[
                    {
                      fontSize: 64,
                      fontFamily: 'DynaPuffBold',
                      textAlign: 'center',
                      lineHeight: 86,
                      letterSpacing: 1.2,
                    },
                  ]}
                >
                  {currentWord?.text_en || ''}
                </Text>
              </Animated.View>
            </GestureDetector>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Translate..."
              autoFocus
              autoCorrect={false}
              placeholderTextColor="gray"
              className="bg-white rounded-full py-4 px-8 mt-8 text-center text-lg w-full max-w-sm leading-snug"
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ThemeGameScreen;
