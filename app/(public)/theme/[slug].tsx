import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, TextInput, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
  const wordColorState = useSharedValue(0);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      wordTranslationX.value = withTiming(-30, { duration: 1000 }, () => {
        wordTranslationX.value = withSpring(0, { duration: 1000 });
      });

      runOnJS(resetInactivityTimer)();
    }, 8000);
  }, [wordTranslationX]);

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      fetchWords({ themeSlug: slug });
    }
  }, [slug, fetchWords]);

  useEffect(() => {
    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (inputText.length > 0) {
      resetInactivityTimer();

      const normalizedInput = normalizeText(inputText);
      const normalizedWord = normalizeText(currentWord?.text_fr || '');

      if (normalizedWord.length === normalizedInput.length) {
        if (normalizedInput === normalizedWord) {
          wordColorState.value = withTiming(1, { duration: 200 });
          setTimeout(() => {
            answerCorrectly({ wordId: currentWord.id });
            wordColorState.value = withTiming(0, { duration: 200 });
          }, 1000);
        } else {
          wordColorState.value = withTiming(-1, { duration: 200 });
          setTimeout(() => {
            wordColorState.value = withTiming(0, { duration: 200 });
          }, 2000);
          answerIncorrectly({ wordId: currentWord.id });
        }

        setInputText('');
      }
    }
  }, [inputText, currentWord, answerCorrectly, answerIncorrectly, resetInactivityTimer, wordColorState]);

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
      runOnJS(resetInactivityTimer)();

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

  const wordViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: wordTranslationX.value }, { translateY: wordTranslationY.value }],
    };
  }, [wordTranslationX, wordTranslationY]);

  const wordColorStyle = useAnimatedStyle(() => {
    let color: string;

    if (wordColorState.value === 1) {
      color = '#22c55e'; // green-500
    } else if (wordColorState.value === -1) {
      color = '#ef4444'; // red-500
    } else {
      const normalColor = isDarkMode ? '#ffffff' : '#000000';
      const redColor = '#ff0000'; // flashy red

      color = interpolateColor(wordTranslationX.value, [0, -150], [normalColor, redColor]);
    }

    return {
      color,
    };
  }, [isDarkMode, wordColorState, wordTranslationX]);

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
            className="absolute left-4 bg-black/20 rounded-full p-2 active:scale-90 transition-all duration-100 z-10"
          >
            <X size={24} color={isDarkMode ? 'white' : 'black'} />
          </Pressable>

          <Animated.View className="absolute left-0 right-0 flex-row items-center justify-center">
            <Animated.Text style={streakFontSizeAnimation}>🔥 {streak}</Animated.Text>
          </Animated.View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <View className="flex-1 items-center justify-center">
            <GestureDetector gesture={panGesture}>
              <Animated.View style={wordViewStyle}>
                <Animated.Text
                  adjustsFontSizeToFit
                  style={[
                    wordColorStyle,
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
                </Animated.Text>
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
