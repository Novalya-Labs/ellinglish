import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, SafeAreaView, TextInput } from 'react-native';
import Text from '@/components/ui/Text';
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
  const navigation = useNavigation();
  const { words, currentWordIndex, loading, fetchWords, answerCorrectly, answerIncorrectly, resetGame } =
    useGameStore();

  const [inputText, setInputText] = useState('');
  const [isError, setIsError] = useState(false);
  const shakeAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    if (slug) {
      fetchWords({ themeSlug: slug });
    }
    // Reset game state on component unmount
    return () => {
      resetGame();
    };
  }, [slug, fetchWords, resetGame]);

  useEffect(() => {
    navigation.addListener('beforeRemove', () => {
      resetGame();
    });
  }, [navigation, resetGame]);

  const currentWord = words[currentWordIndex];

  const handleIncorrectAnswer = useCallback(() => {
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

  useEffect(() => {
    if (!currentWord || !inputText) return;
    const userAnswer = normalizeText(inputText);
    const correctAnswer = normalizeText(currentWord.text_fr);

    if (userAnswer === correctAnswer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setInputText('');
      answerCorrectly({ wordId: currentWord.id });
    } else if (userAnswer.length >= correctAnswer.length) {
      handleIncorrectAnswer();
    }
  }, [inputText, currentWord, answerCorrectly, handleIncorrectAnswer]);

  if (loading || !currentWord) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading game...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-pink-200 dark:bg-purple-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center items-center p-4"
      >
        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
          <Text variant="h1" className={`text-7xl text-center ${isError ? 'text-red-500' : 'text-white'}`}>
            {currentWord.text_en}
          </Text>
        </Animated.View>

        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Translate..."
          autoFocus
          autoCorrect={false}
          className="bg-white rounded-full py-4 px-8 mt-8 text-center text-lg w-full max-w-sm"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ThemeGameScreen;
