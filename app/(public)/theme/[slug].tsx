import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
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

const { width } = Dimensions.get('window');

const ThemeGameScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const navigation = useNavigation();
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

  const [inputText, setInputText] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useMemo(() => new Animated.Value(0), []);
  const swipeX = useRef(new Animated.Value(0)).current;
  const swipeY = useRef(new Animated.Value(0)).current;
  const streakScale = useRef(new Animated.Value(1)).current;
  const inactivityTimer = useRef<number | null>(null);
  const successTimer = useRef<number | null>(null);
  const prevStreak = useRef(0);

  const SWIPE_THRESHOLD = -width * 0.4;
  const HAPTIC_POINT = SWIPE_THRESHOLD * 0.8;

  const startInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(() => {
      Animated.sequence([
        Animated.timing(swipeX, {
          toValue: HAPTIC_POINT * 0.3,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(swipeX, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 5000);
  }, [swipeX, HAPTIC_POINT]);

  const handleNextWord = useCallback(() => {
    swipeX.setValue(0);
    swipeY.setValue(0);
    setHasTriggeredHaptic(false);

    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      startInactivityTimer();
    }, 200);
  }, [fadeAnim, swipeX, swipeY, startInactivityTimer]);

  useEffect(() => {
    if (slug) {
      fetchWords({ themeSlug: slug });
    }
    return () => {
      resetGame();
    };
  }, [slug, fetchWords, resetGame]);

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      resetGame();
    });
  }, [navigation, resetGame]);

  useEffect(() => {
    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      if (successTimer.current) {
        clearTimeout(successTimer.current);
      }
      fadeAnim.stopAnimation();
      shakeAnim.stopAnimation();
      swipeX.stopAnimation();
      swipeY.stopAnimation();
      streakScale.stopAnimation();
    };
  }, [fadeAnim, shakeAnim, swipeX, swipeY, streakScale]);

  const currentWord = words[currentWordIndex];

  const handleIncorrectAnswer = useCallback(() => {
    if (!currentWord) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setIsError(true);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => setIsError(false));
    setInputText('');
    answerIncorrectly({ wordId: currentWord.id });
  }, [shakeAnim, answerIncorrectly, currentWord]);

  const handleSkipWord = useCallback(() => {
    setInputText('');
    setHasTriggeredHaptic(false);
    swipeX.setValue(0);
    swipeY.setValue(0);
    streakScale.setValue(1);
    skipWord();
    handleNextWord();
  }, [swipeX, swipeY, streakScale, handleNextWord, skipWord]);

  const handlePanChange = useCallback(
    (event: PanGestureHandlerEventPayload) => {
      const { translationX, translationY } = event;

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      swipeX.setValue(translationX);
      swipeY.setValue(translationY);

      if (translationX <= HAPTIC_POINT && !hasTriggeredHaptic) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setHasTriggeredHaptic(true);
      }

      if (translationX > HAPTIC_POINT && hasTriggeredHaptic) {
        setHasTriggeredHaptic(false);
      }
    },
    [HAPTIC_POINT, swipeX, swipeY, hasTriggeredHaptic],
  );

  const handlePanEnd = useCallback(
    (event: PanGestureHandlerEventPayload) => {
      const { translationX } = event;

      if (translationX < SWIPE_THRESHOLD) {
        handleSkipWord();
      } else {
        Animated.parallel([
          Animated.timing(swipeX, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(swipeY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
        setHasTriggeredHaptic(false);
        startInactivityTimer();
      }
    },
    [SWIPE_THRESHOLD, swipeX, swipeY, handleSkipWord, startInactivityTimer],
  );

  const panGesture = Gesture.Pan().onChange(handlePanChange).onEnd(handlePanEnd);

  const animateStreakIncrease = useCallback(() => {
    Animated.sequence([
      Animated.timing(streakScale, {
        toValue: 1.8,
        duration: 200,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(streakScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [streakScale]);

  useEffect(() => {
    if (streak > prevStreak.current && streak > 0) {
      animateStreakIncrease();
    }
    prevStreak.current = streak;
  }, [streak, animateStreakIncrease]);

  const handleCorrectAnswer = useCallback(() => {
    if (!currentWord) return;

    setIsSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setInputText('');
    answerCorrectly({ wordId: currentWord.id });

    if (successTimer.current) {
      clearTimeout(successTimer.current);
    }

    successTimer.current = setTimeout(() => {
      setIsSuccess(false);
      handleNextWord();
    }, 600);
  }, [handleNextWord, answerCorrectly, currentWord]);

  useEffect(() => {
    if (!currentWord || !inputText) return;
    const userAnswer = normalizeText(inputText);
    const correctAnswer = normalizeText(currentWord.text_fr);

    startInactivityTimer();

    if (userAnswer === correctAnswer) {
      handleCorrectAnswer();
    } else if (userAnswer.length >= correctAnswer.length) {
      handleIncorrectAnswer();
    }
  }, [inputText, currentWord, handleCorrectAnswer, handleIncorrectAnswer, startInactivityTimer]);

  useEffect(() => {
    startInactivityTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [startInactivityTimer]);

  const handleClose = useCallback(() => {
    resetGame();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }, [router, resetGame]);

  const dynamicWordColor = useMemo(
    () =>
      swipeX.interpolate({
        inputRange: [SWIPE_THRESHOLD, 0],
        outputRange: ['rgb(239, 68, 68)', 'rgb(255, 255, 255)'],
        extrapolate: 'clamp',
      }),
    [swipeX, SWIPE_THRESHOLD],
  );

  const streakFontSize = useMemo(() => {
    const baseFontSize = 16 * streak * 0.4;
    const maxFontSize = 48;
    return Math.min(baseFontSize, maxFontSize);
  }, [streak]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
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
      <SafeAreaView className="flex-1 items-center justify-center">
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

          <Animated.View style={{ transform: [{ scale: streakScale }] }}>
            <Text variant="h1" weight="bold" className="text-white" style={{ fontSize: streakFontSize }}>
              🔥 {streak}
            </Text>
          </Animated.View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <GestureDetector gesture={panGesture}>
            <Animated.View className="flex-1">
              <Pressable className="flex-1 items-center justify-center gap-4 px-4" onPress={() => Keyboard.dismiss()}>
                <Animated.View
                  style={{
                    opacity: fadeAnim,
                    transform: [{ translateX: shakeAnim }, { translateX: swipeX }, { translateY: swipeY }],
                  }}
                >
                  <Animated.Text
                    style={[
                      {
                        fontSize: 64,
                        fontFamily: 'DynaPuffBold',
                        textAlign: 'center',
                        lineHeight: 86,
                        letterSpacing: 1.2,
                        color: isError ? '#ef4444' : isSuccess ? '#22c55e' : dynamicWordColor,
                      },
                    ]}
                  >
                    {currentWord?.text_en || ''}
                  </Animated.Text>
                </Animated.View>
                <TextInput
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Translate..."
                  autoFocus
                  autoCorrect={false}
                  className="bg-white rounded-full py-4 px-8 mt-8 text-center text-lg w-full max-w-sm leading-snug"
                />
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default ThemeGameScreen;
