import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import { Confetti, type ConfettiMethods } from 'react-native-fast-confetti';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  type PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '@/components/ui/Text';
import { getRandomWord, normalizeText, type WordPair } from '@/constants/Words';
import { useTheme } from '@/contexts/theme-context';

const { width } = Dimensions.get('window');

const WordsScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { top } = useSafeAreaInsets();
  const confettiRef = useRef<ConfettiMethods>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const swipeX = useRef(new Animated.Value(0)).current;
  const swipeY = useRef(new Animated.Value(0)).current;
  const streakScale = useRef(new Animated.Value(1)).current;

  const SWIPE_THRESHOLD = -width * 0.4;
  const HAPTIC_POINT = SWIPE_THRESHOLD * 0.8;

  const [inputText, setInputText] = useState('');
  const [currentWord, setCurrentWord] = useState<WordPair>(getRandomWord());
  const [streak, setStreak] = useState(0);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasTriggeredHaptic, setHasTriggeredHaptic] = useState(false);

  const inactivityTimer = useRef<number | null>(null);
  const prevStreak = useRef(0);

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
      setCurrentWord(getRandomWord());
      startInactivityTimer();
    }, 200);
  }, [fadeAnim, swipeX, swipeY, startInactivityTimer]);

  const handleError = useCallback(() => {
    setIsError(true);
    setIsSuccess(false);
    swipeX.setValue(0);
    swipeY.setValue(0);
    setHasTriggeredHaptic(false);
    streakScale.setValue(1);

    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setIsError(false);
    });
  }, [shakeAnim, swipeX, swipeY, streakScale]);

  const handleSkipWord = useCallback(() => {
    setStreak(0);
    setInputText('');
    setHasTriggeredHaptic(false);
    swipeX.setValue(0);
    swipeY.setValue(0);
    streakScale.setValue(1);
    handleNextWord();
  }, [swipeX, swipeY, streakScale, handleNextWord]);

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

  useEffect(() => {
    startInactivityTimer();

    return () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [startInactivityTimer]);

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
    setStreak((prev) => prev + 1);
    setIsSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setInputText('');

    setTimeout(() => {
      setIsSuccess(false);
      handleNextWord();
    }, 600);
  }, [handleNextWord]);

  const handleIncorrectAnswer = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    handleError();
    setStreak(0);
    setInputText('');
  }, [handleError]);

  useEffect(() => {
    if (!inputText) return;

    const userAnswer = normalizeText(inputText);
    const correctAnswer = normalizeText(currentWord.answer);

    startInactivityTimer();

    if (userAnswer === correctAnswer) {
      handleCorrectAnswer();
    } else if (userAnswer.length === correctAnswer.length) {
      handleIncorrectAnswer();
    }
  }, [inputText, currentWord.answer, startInactivityTimer, handleCorrectAnswer, handleIncorrectAnswer]);

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900 relative">
        <View
          className="absolute left-0 right-0 flex-row items-center justify-center px-4 z-10"
          style={{ top: top + 10 }}
        >
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
                        fontSize: 72,
                        fontFamily: 'DynaPuffBold',
                        textAlign: 'center',
                        lineHeight: 86,
                        letterSpacing: 1.2,
                        color: isError ? '#ef4444' : isSuccess ? '#22c55e' : dynamicWordColor,
                      },
                    ]}
                  >
                    {currentWord.word}
                  </Animated.Text>
                </Animated.View>
                <TextInput
                  className="bg-white dark:bg-white rounded-full py-6 px-8 mt-4 active:scale-95 transition-all duration-300 w-md max-w-lg text-center"
                  placeholder="Enter your answer"
                  placeholderTextColor={isDarkMode ? '#581c87' : '#fbcfe8'}
                  style={{ color: isDarkMode ? '#581c87' : '#fbcfe8' }}
                  autoFocus
                  autoCorrect={false}
                  autoComplete="off"
                  value={inputText}
                  onChangeText={setInputText}
                />
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Confetti ref={confettiRef} count={200} fallDuration={3000} blastDuration={1000} autoplay={false} />
    </GestureHandlerRootView>
  );
};

export default WordsScreen;
